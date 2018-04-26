

  function getBell(bId, bellType, control) {
	var $obj;
	if (control) {
		$obj = $('<audio controls preload="auto"' + ' id="'+bId+'" />');
	} else {
		$obj = $('<audio preload="auto"' + ' id="'+bId+'" />');
	} 
	var $srcbell;
	if (bellType == 'big') {
		$srcbell = $('<source/>', {src: "/bell/assets/Bell2.mp3"});
	} else {
		$srcbell = $('<source/>', {src: "/bell/assets/sBell2.mp3"});
	}	
	$obj.append($srcbell);
	return $obj;
  }

/*
    Bell control function
*/

function playBell() {
    document.getElementById('G_BigID').play();
}

function playSmallBell() {
    document.getElementById('G_SmallID').play();
}

function silentBells() {
    document.getElementById('G_BigID').pause();
	document.getElementById('G_SmallID').pause();
}

function containsOnlyNumeric(name) {
    if (name.match(/[^0-9]/) == null) {
        return true;
    }

    alert("Please only input digits.");

    return false;
}

/* 
    Normal Bells 
*/

var timerID=null;

function startTimer(refreshInterval) {
	if (timerID != null) {
		return;
	}

	if (refreshInterval > 0) {
		timerID = setInterval("playSmallBell()", refreshInterval);
    }
}

function stopTimer() {

	if (timerID) {
		clearInterval(timerID);
		timerID  = null;
	}
}

var timerID_b=null;

function startTimer_b(refreshInterval) {
	if (timerID_b != null) {
		return;
	}

	if (refreshInterval > 0) {
		timerID_b = setInterval("playBell()", refreshInterval);
    }
}

function stopTimer_b() {

	if (timerID_b) {
		clearInterval(timerID_b);
		timerID_b  = null;
	}
}


function setStatus(id, msg) {
    var obj = document.getElementById(id);
    obj.innerHTML=msg;
}

function persistSettings() {
	$.cookie("settings", JSON.stringify(settings));
}
/**
Periodically Bell
*/
function startBells() {
    var inputs = document.getElementsByTagName('input');
    for (var i=0; i<inputs.length; i++) {
        if (inputs[i].name == "interval") {
            if (!containsOnlyNumeric(inputs[i].value)) {
               return; 
            }
            stopTimer();
            startTimer(inputs[i].value*60*1000);
        } else if (inputs[i].name == "intervalb") {
            if (!containsOnlyNumeric(inputs[i].value)) {
               return; 
            }
            stopTimer_b();
            startTimer_b(inputs[i].value*60*1000);
        }
    }
	$('#btnPStart').prop('disabled', true);
	$('#btnPStop').prop('disabled', false);
    setStatus("status","In Progress");
	settings.interval = $("#interval").val();
	settings.intervalb = $("#intervalb").val();
	persistSettings();
}

function stopBells() {
    stopTimer();
    stopTimer_b();
    silentBells();
	$('#btnPStart').prop('disabled', false);
	$('#btnPStop').prop('disabled', true);
    setStatus("status","Stop");
}

/*
    Random Bells
*/

function getRandomTimeInterval(timeA, timeB) {
    var retval = 0;
    retval = Math.floor(Math.random()*(timeB-timeA) + timeA);
    return retval;
}

var timerID_rand=null;
var timeA = 0;
var timeB = 0;

function playRandomBell() {
	document.getElementById('G_BigID').play();
    var intval = getRandomTimeInterval(timeA, timeB);

	if (intval > 0) {
		timerID_rand = setTimeout("playRandomBell()", intval);
    }
}

function stopTimer_rand() {

	if (timerID_rand) {
		clearTimeout(timerID_rand);
		timerID_rand  = null;
	}
}

function startRandomBell() {
    var inputs = document.getElementsByTagName('input');
    for (var i=0; i<inputs.length; i++) {
        if (inputs[i].name == "interval_randA") {
            if (!containsOnlyNumeric(inputs[i].value)) {
               return; 
            }
            timeA = inputs[i].value*60*1000;
        } else if (inputs[i].name == "interval_randB") {
            if (!containsOnlyNumeric(inputs[i].value)) {
               return; 
            }
            timeB = inputs[i].value*60*1000;
        }
    }
    stopTimer_rand();

	timerID_rand = setTimeout("playRandomBell()", getRandomTimeInterval(timeA, timeB));

    setStatus("status_rand","In Progress");
	settings.interval_randA = $("#interval_randA").val();
	settings.interval_randB = $("#interval_randB").val();
	persistSettings();
	$('#btnRStart').prop('disabled', true);
	$('#btnRStop').prop('disabled', false);
}

function stopRandomBell() {
    stopTimer_rand();
    silentBells();
    setStatus("status_rand","Stop");
	$('#btnRStart').prop('disabled', false);
	$('#btnRStop').prop('disabled', true);
}

/*
    Clock related functions
*/
function addZero(vNumber) { 
    return ((vNumber < 10) ? "0" : "") + vNumber;
} 

function dateDisplayLookup(val) {
    return addZero(val.getMonth()+1)+"/"+addZero(val.getDate())+"/"+val.getFullYear()+"  "+addZero(val.getHours())+":"+addZero(val.getMinutes())+":"+addZero(val.getSeconds());
}

var clockID = 0;

function UpdateClock() {
   if(clockID) {
      clearTimeout(clockID);
      clockID  = 0;
   }

   var tDate = new Date();

   document.getElementById("theTime").firstChild.data = dateDisplayLookup(tDate);
   // document.getElementById("theTime").firstChild.data = tDate.toString();

/*
   document.getElementById("theTime").firstChild.data = "" 
                                   + tDate.getHours() + ":" 
                                   + tDate.getMinutes() + ":" 
                                   + tDate.getSeconds();
*/                                   

   clockID = setTimeout("UpdateClock()", 1000);
}

function startClock() {
   clockID = setTimeout("UpdateClock()", 500);
}

function stopClock() {
   if(clockID) {
      clearTimeout(clockID);
      clockID  = 0;
   }
}

/*
	Hourly Bell
*/
var timerID_hb_int=null;
var timerID_hb=null;

function playHourlyBell() {
	var d = new Date();
	if (d.getMinutes() == 0) {
		document.getElementById('G_BigID').play();
	}
}

function callEveryHour() {
	playHourlyBell();
    timerID_hb_int = setInterval(playHourlyBell, 1000 * 60 );
}

function hourlyBell() {
	setStatus("status_hourly","Hourly Bell started");
	$('#btnHourlyBell').prop('disabled', true);
	$('#btnStopHourlyBell').prop('disabled', false);
	var d = new Date(),
	h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0),
	e = h - d;
    if (e > 100) { // some arbitrary time period
        timerID_hb = setTimeout(callEveryHour, e);
    }
}

function stopHourlyBell() {
	document.getElementById('G_BigID').pause();
	setStatus("status_hourly","Waiting for input");
	$('#btnHourlyBell').prop('disabled', false);
	$('#btnStopHourlyBell').prop('disabled', true);
	if (timerID_hb) {
		clearTimeout(timerID_hb);
	}
	if (timerID_hb_int) {
		clearInterval(timerID_hb_int);
	}
}

function init() {
    startClock();
	
	var storedSettings = $.cookie("settings");
	
	if (storedSettings == undefined) {
		settings = {};
		settings.interval  = 15;
		settings.intervalb = 30;
		
		settings.interval_randA = 15;
		settings.interval_randB = 60;
		
		var d = new Date();
		var h = new Date(d.getTime()+1000*60*30);
		settings.time_HH = h.getHours();
		settings.time_MM = h.getMinutes();
		settings.time_SS = h.getSeconds();
		
		persistSettings();
	} else {
		settings = JSON.parse(storedSettings);
	}

	$("#interval").val(settings.interval);
	$("#intervalb").val(settings.intervalb);
	
	$("#interval_randA").val(settings.interval_randA);
	$("#interval_randB").val(settings.interval_randB);
	
	$("#time_HH").val(settings.time_HH);
	$("#time_MM").val(settings.time_MM);
	$("#time_SS").val(settings.time_SS);

}

function cleanUp() {
    stopTimer();
    stopTimer_b();
    stopClock();
}