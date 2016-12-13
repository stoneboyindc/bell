
/*
Base class
bellType : big / small
*/
function Bell(bId, bellType, hasControl) {
	this.type = bellType;
	this.id = bId;
	
	this.$obj;
	if (hasControl) {
		this.$obj = $('<audio controls preload="auto"' + ' id="'+bId+'" />');
	} else {
		this.$obj = $('<audio preload="auto"' + ' id="'+bId+'" />');
	} 
	var $srcbell;
	if (bellType == 'big') {
		$srcbell = $('<source/>', {src: "http://www.fungie.info/bell/assets/Bell2.mp3"});
	} else {
		$srcbell = $('<source/>', {src: "http://www.fungie.info/bell/assets/sBell2.mp3"});
	}	
	this.$obj.append($srcbell);
}

Bell.prototype.getHTMLObject = function() {
    return this.$obj;
};

Bell.prototype.getType = function() {
    return this.type;
}; 

Bell.prototype.play = function() {
     document.getElementById(this.id).play();
}; 

Bell.prototype.pause = function() {
     document.getElementById(this.id).pause();
}; 

/*
Periodic Bell
*/
function PBell(bId, bellType) {
	this.timerID=null;
	this.endTimerID=null;
	this.bell = new Bell(bId, bellType);
}
/* Get the HTML Object of Bell */
PBell.prototype.getHTMLObject = function() {
    return this.bell.getHTMLObject();
};

PBell.prototype.play = function() {
     this.bell.play();
}; 

PBell.prototype.pause = function() {
     this.bell.pause();
}; 
/* Start the timer */
PBell.prototype.startTimer = function (refreshInterval, endPeriod, p, resetButtons) {

	if (this.timerID != null) {
		return;
	}

	if (refreshInterval > 0) {
		this.timerID = setInterval(function() { p.play(); }, refreshInterval);
    }
	
	if (endPeriod > 0) {
		this.endTimerID = setInterval(function() { p.stop(); resetButtons.call(); }, endPeriod);
	}
}
/* Stop the timer */
PBell.prototype.stopTimer= function () {
	if (this.timerID) {
		clearInterval(this.timerID);
		this.timerID  = null;
	}
	if (this.endTimerID) {
		clearInterval(this.endTimerID);
		this.endTimerID  = null;
	}
}

PBell.prototype.setStatus = function (id, msg) {
    var obj = document.getElementById(id);
    obj.innerHTML=msg;
}

PBell.prototype.start =function (tVal, endPeriod, p, resetButtons) {
	this.stopTimer();
    this.startTimer(tVal*60*1000, endPeriod*60*1000, p, resetButtons);
	this.setStatus("status","In Progress");
}

PBell.prototype.stop =function () {
	this.stopTimer();
    this.bell.pause();
    this.setStatus("status","Waiting For Input");
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

function init() {

    startClock();
}

function cleanUp() {
    stopTimer();
    stopTimer_b();
    stopClock();
}