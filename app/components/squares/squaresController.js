squaresModule
.controller('squaresCtrl',
    ["$scope", "$state", "$http", '$log', 'squaresFactory',
    function($scope, $state, $http, $log, squaresFactory){
      $scope.log = $log;
      $scope.squares = [];
      $scope.name="";
      $scope.square = squaresFactory;

      $scope.isNumber = function(x,y) {
        return ((x == 0) || (y == 0));
      };

      $scope.paint = function() {
        for (var i=0; i<11; i++) {
          // inner loop applies to sub-arrays
          $scope.squares.push([]);
          for (var j=0; j<11; j++) {
            // accesses each element of each sub-array in turn
            // console.log( $scope.squares[i][j] );
            if ($scope.isNumber(i,j)) {
              $scope.squares[i].push({style: "square number"});
            }
            else {
              $scope.squares[i].push({
                selected: false,
                style: "square"
              });
            }
          }
        }
      }

      $scope.isSelected = function(x,y) {
        return $scope.squares[x][y].selected;
      };
      $scope.isMine = function(x,y) {
        return ($scope.squares[x][y].name == $scope.name);

      };

      $scope.repaint = function() {
        console.log('repaint');
        for (var x=1; x<11; x++) {
          for (var y=1; y<11; y++) {
            $scope.setstyle(x,y);
          }
        }
      }

      $scope.clickit = function(x,y) {
        console.log("["+x+"]["+y+"]");

        // need a name, dummy
        if ($scope.name == '') {
          console.log("Name is required");
          return;
        }

        // is this taken?
        if ($scope.isSelected(x,y)){
          // is it taken by the current user?
          if ($scope.isMine(x,y)) {
            $scope.squares[x][y].name = undefined;
            $scope.squares[x][y].selected = false;
          } else {
            console.log('you dont own this bitch');
          }
        }
        else {
          $scope.squares[x][y].selected = true;
          $scope.squares[x][y].name = $scope.name;
        }
        $log.debug($scope.squares);
        this.setstyle(x,y);
      };

      $scope.setstyle= function(x,y) {
        // if it's owned by someone else then one color
        if ($scope.isSelected(x,y)) {
          if ($scope.isMine(x,y)) {
            $scope.squares[x][y].style = "square sq-mine";
          }
          else {
            // if it's owned by me then highlight it
            $scope.squares[x][y].style = "square sq-selected";
          }

        }
        else {
          $scope.squares[x][y].style = "square";
        }
      };

      $scope.fill = function(boxes) {
        var items = boxes.length;
        for (var i=0; i < items; i++) {
          var box = boxes[i];
          if ($scope.isNumber(box.x, box.y)) { continue; }
          $scope.squares[box.x][box.y].name = box.name;
          $scope.squares[box.x][box.y].user_id = box.user_id;
          $scope.squares[box.x][box.y].id = box.id;
          $scope.squares[box.x][box.y].selected = true;
          $scope.setstyle(box.x, box.y);
        }
      }

      $scope.paint();
      $scope.fill($scope.square.boxes);
    }]);
// squaresModule
// .factory('squaresFactory',
//   ['$http',
//   function($http){}]);