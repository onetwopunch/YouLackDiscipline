//This file is the javascript for the Bacground Page, where users
//land when they view their Urls.


//background color of sky: #7D9FD3
//

//if power data is not set, set it to be on
$(document).ready(function(){

    if (!localStorage.hasBeenUsed){
		var starterList= ["twitter.com","www.facebook.com","www.linkedin.com","www.reddit.com","www.stumbleupon.com", "www.tumblr.com"];
		localStorage.power = "off"
		localStorage.urlList = JSON.stringify(starterList);
		localStorage.hasBeenUsed = true;
		localStorage.startHr = "null";
		localStorage.endHr = "null";
		localStorage.startMin = "null";
		localStorage.endMin = "null";
    }

    tmp = new Array();
	tmp = JSON.parse(localStorage.urlList);
		
	var list = "<form name = 'url' action = '' method = 'post'>";
	list +="<ul id='urlList'>"
	 for(var i = 0;i <tmp.length; i++){
		list = list +"<li class='checklist' id='item"+i+"'><input type = 'checkbox' name = 'list' value = '" +i+"'/>"
				+ tmp[i] +"</li>";
	}
	list = list + "</ul></form>";
	document.getElementById("list").innerHTML = list;

       
    $('#deleteBtn').click(function(){
    	deleteUrl();
    });  
            

});


function deleteUrl(){
	oldList = new Array();
	newList = new Array();
	oldList = JSON.parse(localStorage.urlList);
	
	for(i = 0; i<document.url.list.length; i++){
		if(document.url.list[i].checked !=true){
			newList.push(oldList[i]);
		} else {
			$('#item'+i).fadeOut('slow');
		}
	}
	
	delete oldList;
	localStorage.urlList = JSON.stringify(newList);
	// chrome.tabs.reload();
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	//check if it is now within the work interval
	var date = new Date();

	//convert times into 4 digit numbers and then compare
	var start = (localStorage.startHr *100) + parseInt(localStorage.startMin);
	var end = (localStorage.endHr * 100) + parseInt(localStorage.endMin);
	var now = (date.getHours() * 100) + date.getMinutes();

	if(now >= start && now <= end)
		localStorage.power = "on";

	if(localStorage.power == "on"){
		tmp = new Array();
		tmp = JSON.parse(localStorage.urlList);
		for(var i = 0; i < tmp.length; i++){
			if(url_domain(tab.url) == tmp[i]){
				chrome.tabs.update(tab.id, {url:"discipline.html"});				
			}
		}
	}
});
