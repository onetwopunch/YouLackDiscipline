$(document).ready(function(){
                
	setPowerButton();

	initTimeValues();
	                   
	$('#editBtn').click(function(){
		openBackground();
	});  
	$('#addBtn').click(function(){
		addToList();
	});                              
	$('#powerBtn').click(function(){
		togglePower();
	});
	$('#setIntervalBtn').click(function(){
		setWorkInterval();
	});
	$('#resetIntervalBtn').click(function(){
		resetWorkInterval();
	});
                
});

function setPowerButton(){
  //initialize power button and functionality
	$('#power').attr("src", function(i, val){
	   if(localStorage.power =="on"){
			return "images/on.png"
	   }else if(localStorage.power == "off"){
			return "images/off.png"
	   }else{
			localStorage.power = "on"
			return "images/on.png"
	   }

	});
}
function initTimeValues(){

//initialize date &time 
	var now = new Date();
	var startHr = function(){
		if(now.getHours() >12){
			$('#startAmPm>option:eq(1)').prop('selected', true);
			return now.getHours() - 12;
			}
		else{
			return now.getHours();
			}
	}
	var endHr = function(){
	if(now.getHours() >12){
		$('#endAmPm>option:eq(1)').prop('selected', true);
		return now.getHours() - 11;
	}
	else{
		return now.getHours() +1;
	}
	}
	var mins = function(){
		return (now.getMinutes() < 10) ? "0"+now.getMinutes() : now.getMinutes();
	}



	if (localStorage.startHr == "null")
		$('#startHr').val(startHr);
	else { 
		$('#startHr').val(localStorage.startHr % 12);
		if(localStorage.startHr > 12)
			$('#startAmPm>option:eq(1)').prop('selected', true);
		toggleSet(true);
		}
	if (localStorage.startMin == "null")
		$('#startMin').val(mins);
	else {
		$('#startMin').val((localStorage.startMin < 10) ? "0"+localStorage.startMin : localStorage.startMin);
		toggleSet(true);
		}
	if (localStorage.startMin == "null")
		$('#endHr').val(endHr);
	else {
		$('#endHr').val(localStorage.endHr %12);
		if(localStorage.endHr > 12)
			$('#endAmPm>option:eq(1)').prop('selected', true);
		toggleSet(true);
		}
	if (localStorage.startMin == "null")
		$('#endMin').val(mins);
	else{
		$('#endMin').val((localStorage.endMin < 10) ? "0"+localStorage.endMin : localStorage.endMin);
		toggleSet(true);
		}


}

		
function openBackground(){
	chrome.tabs.create({'url': chrome.extension.getURL('background.html')}, function(tab) { });
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

function addToList(){
	chrome.tabs.getSelected(null,function(tab) {
    var tablink = url_domain(tab.url);

	
//If the urlList has data, parse from JSON, store into temp, add new URL
//then stringify again
	if(localStorage.urlList){
		tmp = new Array();    
		var urlExists = true;
		tmp = JSON.parse(localStorage.urlList);
		
		//this for loop checks if the current url is already in the list
		//but if uncommented, none of the buttons work
 		for(i = 0; i<tmp.length; i++){
 			if(tablink == tmp[i]){
 				urlExists = false;
 			}
 		}
 		if(urlExists == true){
			tmp.unshift(tablink);
			tmp.sort();
			localStorage.urlList = JSON.stringify(tmp);
		}
		delete tmp;
	}
	
//If urlList is empty, fill the first element with the new URL
	else{
		tmp = new Array();
		tmp[0] = tablink;
		localStorage.urlList = JSON.stringify(tmp);
		delete tmp;
	}    
});
	window.close();
}

function setPower(switchOn){
	if (switchOn){
		$('#power').attr("src", "images/on.png");
		localStorage.power = "on";
	} else {
		$('#power').attr("src", "images/off.png");		
		localStorage.power = "off";
	}
}

function togglePower(){

	if(localStorage.power =="on"){
		setPower(false)
		}
	else if(localStorage.power == "off"){
		setPower(true)
	} 	
}

function setPowerAfterWorkInterval(){
	////////////
	///if the current time is during the work interval, power = "on"
	///////////

	// 11:45
	// 13:02
	// 16:35
	//1145 <= 1302 <=1635
	var date = new Date();

	//convert times into 4 digit numbers and then compare
	var start = (localStorage.startHr *100) + parseInt(localStorage.startMin);
	var end = (localStorage.endHr * 100) + parseInt(localStorage.endMin);
	var now = (date.getHours() * 100) + date.getMinutes();

	// localStorage.msg = start + " <= " +now + " <= " + end;
	if(now >= start && now <= end)
		setPower(true);
	else
		setPower(false);

}
function setWorkInterval(){
	
	//set start time
	localStorage.startMin = parseInt(document.timeForm.startMin.value);
	if(document.timeForm.startAmPm[0].selected){
		var hour = document.timeForm.startHr.value;
		localStorage.startHr = (parseInt(hour) == 12) ? 0 : parseInt(hour);
	}else{
		var hour = document.timeForm.startHr.value;
		localStorage.startHr = parseInt(hour) + 12;
	}
	
	//set end time
	
	localStorage.endMin = parseInt(document.timeForm.endMin.value);
	if(document.timeForm.endAmPm[0].selected){
		
		var hour =  document.timeForm.endHr.value;
		localStorage.endHr = (parseInt(hour) == 12) ? 0 : parseInt(hour);

	}else{
		var hour = document.timeForm.endHr.value;	
		localStorage.endHr = parseInt(hour) + 12;
	}
	setMessage("Work Interval Set");
	toggleSet(true);
	setPowerAfterWorkInterval();
}

function resetWorkInterval(){
	localStorage.startMin = "null";
	localStorage.startHr = "null";
	localStorage.endMin = "null";
	localStorage.endHr = "null";
	//localStorage.power = "on";
	initTimeValues();
	setMessage("Work Interval Reset");
	toggleSet(false);
}

function setMessage(msg){
	document.getElementById('message').innerHTML = msg;
	$('#message').fadeIn('slow');
	$('#message').delay(2000).fadeOut('slow');
	}
function toggleSet(shouldSet){
	if(shouldSet == true)
		$('#SET').css("visibility", "visible");
	else
		$('#SET').css("visibility", "hidden");
}