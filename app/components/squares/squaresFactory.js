
squaresModule
.factory('squaresFactory',[
  '$http',
  '$log',
  // 'APP_CONFIG',
  'toastr',
  function($http, $log,
    // APP_CONFIG,
    toastr){
    var square;
    var putSquare = function(e){
      estimate = e;
    };
    var getSquare = function(id){
      // Make sure the ids match
      if ((typeof(estimate) === 'undefined') ||
          (square.id != id)) {

        // url = APP_CONFIG.API_URL + '/squares/' + id + '.json';
        var url = 'http://localhost:3000/squares/1.json'
        $log.debug(url);
        $http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
          $log.debug(response.data);
            // this callback will be called asynchronously
            // when the response is available
            angular.copy(response.data, estimate);
            // $log.debug('we got it too ' + JSON.stringify(o.estimates));
          });
      }
      return square;
    };

    return {
      putSquare: putSquare,
      getSquare: getSquare,
    };
}]);

// squaresModule
// .factory('myOrderFactory', [
//     'helperService',
//     '$http',
//     '$log',
//     "$state",
//     'APP_CONFIG',
//     'commentsFactory',
//     function(helperService, $http, $log, $state, APP_CONFIG, commentsFactory){
//     var service = {};
//     service.data = {};

//     service.createOrder = function(estimate) {
//       // $log.debug('createOrder estimate = ' + JSON.stringify(estimate));
//       // $log.debug('lead time - ' + estimate.lead_time.toString());
//       url = APP_CONFIG.API_URL + '/api/marketplace_projects.json';
//       imd = new Date();

//       return $http({
//         method: 'POST',
//         url: url,
//         data: {
//           marketplace_project: {
//             quantity: estimate.quantity,
//             lead_time: estimate.lead_time,
//             fast_format_id: estimate.format.id,
//             name: estimate.name
//           }
//         }

//       }).then(function successCallback(response) {
//           angular.copy(response.data, service.data);
//           service.setComputedValues();
//           window.location.href = helperService.buildURL('/order/' + service.data.id);
//         });
//     };

//     service.getOrder = function(id){
//       url = APP_CONFIG.API_URL + '/api/marketplace_projects/' + id + '.json';
//       return $http({
//         method: 'GET',
//         url: url
//       }).then(function successCallback(response) {
//           angular.copy(response.data, service.data);
//           service.setComputedValues();
//           commentsFactory.getComments(service.data.comment_thread.id);
//         });
//     };

//     service.updateOrder = function(field) {
//       url = APP_CONFIG.API_URL + '/api/marketplace_projects/'+service.data.id+'.json';
//       return $http({
//         method: 'PATCH',
//         url: url,
//         data: {
//           marketplace_project: field
//         }
//       }).then(function successCallback(response) {
//           angular.copy(response.data, service.data);
//           service.setComputedValues();
//           return response;
//         });
//     };

//     // sets postage string and min calendar date
//     // add more method calls as needed
//     service.setComputedValues = function(){
//       service.setPostageString();
//       service.setMinDate();
//       service.isInMarketDateEnabled();
//       service.isInMarketDateValid();
//     };

//     service.setMinDate = function(){
//       var newDate = new Date(new Date().getTime()+((service.data.lead_time + 259200)*1000));
//       var newMonth = newDate.getMonth() + 1;
//       service.data.min_date = newDate.getFullYear() + '/' + newMonth  + '/' + newDate.getDate();
//     };

//     service.isFirstClass = function() {
//       return service.data.postage.service_class == "First Class";
//     };

//     service.setPostageString = function(){
//       if (service.data.postage.service_class === "First Class"){
//         service.data.postage.display_string = "Requires first class mailing";
//         return;
//       }

//       service.data.postage.display_string = "Standard class mailing";
//     };

//     service.isInMarketDateEnabled = function(){
//       if (service.data.status === "planning"){
//         service.data.isIMDEnabled = true;
//         return;
//       }

//       service.data.isIMDEnabled = false;
//     };

//     service.isInMarketDateValid = function(){
//       var date1 = new Date(service.data.in_market_date.replace(/-/g, '/'));
//       var date2 = new Date(service.data.min_date);

//       var timeDiff = date2.getTime() - date1.getTime();
//       var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

//       if(diffDays <= 0 || service.data.isIMDEnabled === false)
//         service.data.isIMDValid = true;
//       else
//         service.data.isIMDValid = false;
//     };

//   return service;
//   }]);

// orderModule
// .factory('orderUsersFactory', [
//     '$http',
//     '$log',
//     'APP_CONFIG',
//     function($http, $log, APP_CONFIG){
//     var service = {};
//     service.users = [];
//     service.userIds = [];

//     service.getUsers = function(id){
//       var url = APP_CONFIG.API_URL + '/api/projects/' + id + '/project_users.json';
//       return $http({
//         method: 'GET',
//         url: url
//       }).then(function successCallback(response){
//         angular.copy(response.data, service.users);

//         service.userIds = [];

//         for(var index in service.users) {
//           service.userIds.push(service.users[index].id);
//         }
//       });
//     };

//     service.deleteUser = function(projectId, userId) {
//       var url = APP_CONFIG.API_URL + '/api/projects/' + projectId + '/project_users/' + userId + '.json';
//       return $http({
//         method: 'DELETE',
//         url: url,
//         data: {
//           user_id: userId,
//           project_id: projectId,
//         }
//       });
//     };

//     service.addUser = function(projectId, userId) {
//       var url = APP_CONFIG.API_URL + '/api/projects/' + projectId + '/project_users.json';
//       return $http({
//         method: 'POST',
//         url: url,
//         data: {
//           user_id: userId,
//           project_id: projectId,
//         }
//       });
//     };

//   return service;
//   }]);

// orderModule
// .factory('commentsFactory', [
//     '$http',
//     '$log',
//     'APP_CONFIG',
//     function($http, $log, APP_CONFIG){

//     var service = {},
//         busy = false;

//     service.comments = [];

//     service.getComments = function(id){
//       // return if in process of getting comments
//       if(busy === true) {return;}

//       var url = APP_CONFIG.API_URL + '/api/comment_threads/' + id + '/comments.json';
//       busy = true;

//       return $http({
//         method: 'GET',
//         url: url
//       }).then(function successCallback(response){
//         angular.copy(response.data, service.comments);
//       }).then(function always(){
//         busy = false;
//       });
//     };

//     service.addComment = function(id, comment) {
//       var url = APP_CONFIG.API_URL + '/api/comment_threads/' + id + '/comments.json';
//       return $http({
//         method: 'POST',
//         url: url,
//         data: {
//           comment: comment
//         }
//       });
//     };
//   return service;
//   }]);

//   orderModule
//   .factory('orderSegmentFactory', [
//       '$http',
//       '$log',
//       'APP_CONFIG',
//       function($http, $log, APP_CONFIG){
//       var service = {};
//           service.data = {};

//     service.getSegments = function(projectId)
//     {
//       var url = APP_CONFIG.API_URL + '/api/marketplace_projects/' + projectId + '/segments';

//       return $http({
//         method: 'GET',
//         url: url
//       }).then(function successCallback(response){
//         service.data.segmentRows = response.data;
//         return service.data.segmentRows;
//       });
//     };

//     service.addSegment = function(projectId,segmentName)
//     {
//       var url = APP_CONFIG.API_URL + '/api/marketplace_projects/' + projectId + '/segments';

//       return $http({
//         method: 'POST',
//         url: url,
//         data: {
//           segment: {name: segmentName}
//         }
//       }).then(function successCallback(response) {
//           //
//         });
//     };

//     service.updateSegment = function(segmentId, field)
//     {
//       var url = APP_CONFIG.API_URL + '/api/segments/' + segmentId;

//       return $http({
//         method: 'PATCH',
//         url: url,
//         data: {
//           segment: field
//         }
//       }).then(function successCallback(response) {
//           //
//         });
//     };

//     service.deleteSegment = function(segmentId)
//     {
//       var url = APP_CONFIG.API_URL + '/api/segments/' + segmentId;

//       return $http({
//         method: 'DELETE',
//         url: url
//       }).then(function successCallback(response) {
//           //
//         });
//     };

//   return service;
//   }]);

//   orderModule
//   .factory('orderUserApprovalFactory', [
//     '$http',
//     '$log',
//     'APP_CONFIG',
//     function($http, $log, APP_CONFIG){
//     var service = {};

//     service.addApproval = function(segmentId,approverId)
//     {
//       var url = APP_CONFIG.API_URL + '/api/segments/'+segmentId+'/approvals';
//       return $http({
//         method: 'POST',
//         url: url,
//         data: {
//           approver_id: approverId,
//           comment:'',
//           state:'pending'
//         }
//       });
//     };

//     service.deleteApproval = function(approvalId)
//     {
//       var url = APP_CONFIG.API_URL + '/api/approvals/' + approvalId;
//       return $http({
//         method: 'DELETE',
//         url: url
//       });
//     };

//     service.getApproversForSegment = function(segmentId)
//     {
//       var url = APP_CONFIG.API_URL + '/api/segments/'+segmentId+'/approvals';
//       return $http({
//         method: 'GET',
//         url: url
//       });
//     };

//     service.updateHeadApprover = function(segmentId, userId)
//     {
//       url = APP_CONFIG.API_URL + '/api/segments/'+segmentId;
//       return $http({
//         method: 'PATCH',
//         url: url,
//         data: {
//           approver_id: userId
//         }
//       });
//     };

//     service.updateApproval = function(approvalId, state)
//     {
//       var url = APP_CONFIG.API_URL + '/api/approvals/' + approvalId;
//       return $http({
//         method: 'PATCH',
//         url: url,
//         data: {
//           state: state
//         }
//       });
//     };

//   return service;
//   }]);
