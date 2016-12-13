var app = angular.module('app', []);

angular.module('app').controller('MainCtrl', function ($scope, $compile) {
	
	$scope.add = function(ev,attrs){
	  
	  var tpl = angular.element('<bell></bell>');
	  var newScope = $scope.$new(true);

	  $compile(tpl)(newScope);
      //$scope.insertHere = el;
	  $("#reminderBell").append(tpl);
    };

    $scope.delete = function(ev,attrs){//$on('insertItem',function(ev,attrs){
		if ($("#reminderBell").children().length > 1) {
			$("#reminderBell").children().last().remove();
		}
		//$( ".reminderBell" ).remove();
    };
});


// directive
angular.module('app')
  .directive('bell', function () {
    return {
     	templateUrl: 'js/reminderBell.tpl.html',
      	restrict: 'E',
		replace: "true"
    };
  });
  
angular.module('app').controller('bellCtrl', function ($scope, $timeout) {
	$scope.bellType = "big";
	
	var date = new Date();
	var hours = date.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
	
	$scope.m = {
		second:  date.getSeconds(),
		minute:  date.getMinutes(),
		hour: hours,
		ap: ampm
	}
	
	$scope.timerID=null;
	$scope.disabled = false;
	
	$scope.playReminderBell = function() {
		if ($scope.timerID != null) {
			return;
		}
    
	    $('#G_BigID').play();

	    $timeout.cancel($scope.timerID);
	    //setStatus("status_reminder","Time passed");
	}

	$scope.stopTimer = function() {

		if ($scope.timerID) {
			$timeout.cancel($scope.timerID);
			$scope.timerID  = null;
		}
		$scope.disabled = false;
	}
	
	$scope.startBell = function () {
	    var d = new Date()
		
		var hour = ($scope.m.ap === "am" ? $scope.m.hour : $scope.m.hour+12);
	    d.setHours(hour);
        d.setMinutes($scope.m.minute);
		d.setSeconds($scope.m.second);
	    $scope.stopTimer();

	    var now = new Date();
	    var diff = d.getTime() - now.getTime();
	    if (diff <= 0) {
	        alert("Please input a future time.");
	        return;
	    }
	
		$scope.disabled = true;
	
		$scope.timerID = $timeout(function(){
			if ($scope.bellType === "big") {
		 	  	document.getElementById('G_BigID').play();
			} else {
				document.getElementById('G_SmallID').play();
			}
		    $timeout.cancel($scope.timerID);
			$scope.disabled = false;	
		}, diff);

	    //setStatus("status_reminder","In Progress");
		/*settings.time_HH = $("#time_HH").val();
		settings.time_MM = $("#time_MM").val();
		settings.time_SS = $("#time_SS").val();
		persistSettings();*/
	}
	
	
  });
