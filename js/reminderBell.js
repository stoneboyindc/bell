    <tr>
        <td style="text-align:left;">I would like a reminder bell at</td>
        <td><input type="text" id="time_HH" name="time_HH" size=2 maxlength=2>:<input type="text" id="time_MM" name="time_MM" size=2 maxlength=2>:<input type="text" id="time_SS" name="time_SS" size=2 maxlength=2></td>
        <td style="text-align: center"><button onclick="startReminderBell()">Set</button> (using 24 hour clock - e.g. 10:43pm is 22:43:00)</td>
    </tr>
	
	/*
	    Reminder Bell
	*/


	var timerID_reminder=null;

	function playReminderBell() {
		if (timerID_reminder != null) {
			return;
		}
    
	    document.getElementById('G_BigID').play();

	    stopTimer_reminder();
	    setStatus("status_reminder","Time passed");
	}

	function stopTimer_reminder() {

		if (timerID_reminder) {
			clearInterval(timerID_reminder);
			timerID_reminder  = null;
		}
	}

	function startReminderBell() {
	    var inputs = document.getElementsByTagName('input');
	    var hour = 0;
	    var min = 0;
	    var sec = 0;
	    var d = new Date()

	    for (var i=0; i<inputs.length; i++) {
	        if (inputs[i].name == "time_HH") {
	            if (!containsOnlyNumeric(inputs[i].value)) {
	               return; 
	            }
	            d.setHours(inputs[i].value);
	        } else if (inputs[i].name == "time_MM") {
	            if (!containsOnlyNumeric(inputs[i].value)) {
	               return; 
	            }
	            d.setMinutes(inputs[i].value);
	        } else if (inputs[i].name == "time_SS") {
	            if (!containsOnlyNumeric(inputs[i].value)) {
	               return; 
	            }
	            d.setSeconds(inputs[i].value);
	        }
	    }
	    stopTimer_reminder();

	    var now = new Date();
	    var diff = d.getTime() - now.getTime();
	    if (diff <= 0) {
	        alert("Please input a future time.");
	        return;
	    }

		setTimeout("playReminderBell()", diff);

	    setStatus("status_reminder","In Progress");
		settings.time_HH = $("#time_HH").val();
		settings.time_MM = $("#time_MM").val();
		settings.time_SS = $("#time_SS").val();
		persistSettings();
	}

	function stopReminderBell() {
	    stopTimer_reminder();
	    silentBells();
	    setStatus("status_reminder","Stop");
	}
	