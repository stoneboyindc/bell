var app = angular.module('app', ['ngCookies']);

app.controller('MainCtrl', function ($scope, $compile, $cookies) {
	

	$scope.add = function(bellObj) {
	  	//console.log(bellObj);
	  	var m = bellObj;
	  	if (m == null) {
		 	var date = new Date();
			var hours = date.getHours();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'

			m = {
				bellType: "big",
				second:  date.getSeconds(),
				minute:  date.getMinutes(),
				hour: hours,
				ap: ampm
			}
		}

		var tpl = angular.element('<bell></bell>');
		var newScope = $scope.$new(true);
		newScope.m = m;

		$compile(tpl)(newScope);
		//$scope.insertHere = el;
		$("#reminderBell").append(tpl);
    };

    $scope.delete = function(ev,attrs){//$on('insertItem',function(ev,attrs){
		if ($("#reminderBell").children().length > 1) {
			$("#reminderBell").children().last().remove();
		}
		$scope.persist();
    };

	$scope.persist = function () {
		var array = [];
		$("#reminderBell").children().each(function(){
    		var s = angular.element(this).scope();
    		array.push(s.m);
		});
		$cookies.putObject("reminderBell",array);
	}

    var bells = $cookies.getObject("reminderBell");
    if (bells != null) {
	    bells.forEach(function(obj){
	    	if (obj != null) {
	    		//console.log(obj);
	    		$scope.add(obj);
	    	}
	    })
	}

});


// directive
app.directive('bell', function () {
    return {
     	templateUrl: 'js/reminderBell.tpl.html',
      	restrict: 'E',
		replace: true
    };
  });
  
app.controller('bellCtrl', function ($scope, $timeout, $cookies) {
	
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
	        alert("You enter a tomorrow's time.");
	        diff += 24*60*60*1000;
	    }
	
		$scope.disabled = true;
	
		$scope.timerID = $timeout(function(){
			if ($scope.m.bellType === "big") {
		 	  	document.getElementById('G_BigID').play();
			} else {
				document.getElementById('G_SmallID').play();
			}
		    $timeout.cancel($scope.timerID);
			$scope.disabled = false;	
		}, diff);

		$scope.persist();
	}
	
	$scope.persist = function () {
		var array = [];
		$("#reminderBell").children().each(function(){
    		var s = angular.element(this).scope();
    		array.push(s.m);
		});
		$cookies.putObject("reminderBell",array);
	}
	
  });
