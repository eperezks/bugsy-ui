require 'fileutils'
require 'pry'
require 'json'
require 'rest-client'
require 's3_uploader'



# S3Uploader.upload_directory('dist', 'km-janus', { :destination_dir => 'test/', :threads => 4 })
class Uploader

  S3_BUCKETS = { production: 'eduardoperez.us' }
  UPLOAD_DIRS = ['assets','components']
  UPLOAD_FILES = ['index.html',
                  'version.txt',
                  'app.routes.js',
                  'app.module.js']

  def initialize(env)
    @env = env
  end

  def upload_file(file, dir='')
    cmd = "aws s3 cp #{file} s3://#{S3_BUCKETS[@env.to_sym]}/"
    cmd += "#{dir}/" unless dir.empty?
    puts cmd
    `#{cmd}`
    fail 'Failure pushing zip file to s3' if $CHILD_STATUS.to_i != 0
  end

  def upload_files(tag, back_up_tag)
    key,secret = aws_creds

    # back up the previous deployment
    cmd = "aws s3 mv s3://#{S3_BUCKETS[@env.to_sym]}/#{tag}/ s3://#{S3_BUCKETS[@env.to_sym]}/#{back_up_tag}/ --recursive"
    puts cmd
    `#{cmd}`
    fail 'Failure moving previous deployment.' if $CHILD_STATUS.to_i != 0

    UPLOAD_DIRS.each do |dir|
      S3Uploader.upload_directory("#{dir}", "#{S3_BUCKETS[@env.to_sym]}",
          {    :s3_key => key,
                 :s3_secret => secret,
                 :destination_dir => "#{tag}/#{dir}",
                 :region => 'us-east-1',
                 :threads => 4
          })
    end

    UPLOAD_FILES.each do |file|
      upload_file(file, tag)
    end
  end

  def aws_creds
    key = ''
    secret = ''
    a = File.read("#{ENV['HOME']}/.aws/credentials").split("\n")
    a.each do |i|

      k,v = i.delete(' ').split('=');
      if k ==  'aws_access_key_id'
        key = v
      end

      if k == 'aws_secret_access_key'
        secret = v
      end
    end
    return key,secret
  end

  def aws_config
    out = ''
    if File.exist?("#{ENV['HOME']}/.aws/config")
      # read in the file
      a = File.read("#{ENV['HOME']}/.aws/config").split("\n")
      bfound = false
      a.each { |e|
        if e.start_with? 'region'
          bfound = true
          out = out + "region = us-east-1\n"
        else
          # add it back to the string that will be written out
          out = out + "#{e}\n"
        end
      }
      out = out + "region = us-east-1\n" unless bfound
    else
      out = out + "[default]\nregion = us-east-1"
    end

    # make any modifications
    File.open("#{ENV['HOME']}/.aws/config", 'w') { |file| file.truncate(0) }
    File.open("#{ENV['HOME']}/.aws/config", 'w') { |file| file.write(out) }

    `chmod 600 #{ENV['HOME']}/.aws/config`
    `chmod 600 #{ENV['HOME']}/.aws/credentials`
  end

  def bugsy_root?
    File.exist?('app/index.html') &&
      File.exist?('app') &&
      File.exist?('build') &&
      File.exist?('config')
  end

  def main
    # make sure the current working directory is the root of your rails site
    fail 'Script must be run from root of your angular application using "bundle exec ruby devops/deploy.rb"' unless bugsy_root?

    aws_config

    commit_id = `git rev-parse --verify HEAD | cut -c 1-7`.strip
    commit_msg = nil

    branch = nil
    `git branch -l`.split("\n").each do |item|
      branch = item.tr('* ', '') if item[0] == '*'
    end

    fail 'Unable to determine branch name' if branch.nil?

    timestamp = Time.now.utc.to_s.gsub(' ','_')

    tag = 'bugsy'

    back_up_tag = "#{timestamp}-#{commit_id}-#{branch}"


    # labels can be at max 100 characters so truncate and make room for the timestamp
    version_label = "#{commit_id}-#{branch} #{commit_msg}".chop.slice(0,76)
    version_label = version_label + " #{timestamp}"

    File.open("build/version.txt", 'w') { |file| file.truncate(0) }
    File.open("build/version.txt", 'w') { |file| file.write(version_label) }

    commit_msg = `git log -1 --pretty=%B | head -1 | sed 's#/#|#g'`

    #  Only deploy files from the build directory!
    Dir.chdir "build"
    upload_files(tag, back_up_tag)
  end
end

if __FILE__ == $PROGRAM_NAME
  Uploader.new(ARGV[0]).main
else
end
