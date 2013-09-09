//This file is the javascript for the Bacground Page, where users
//land when they view their Urls.


//background color of sky: #7D9FD3
//

//if power data is not set, set it to be on
$(document).ready(function(){

    if (!localStorage.hasBeenUsed){
		var starterList= ["twitter.com","facebook.com","linkedin.com","reddit.com","stumbleupon.com", "tumblr.com"];
		localStorage.power = "off"
		localStorage.urlList = JSON.stringify(starterList);
		localStorage.hasBeenUsed = true;
		localStorage.startHr = "null";
		localStorage.endHr = "null";
		localStorage.startMin = "null";
		localStorage.endMin = "null";
    }
    if(!localStorage.version22){
    	//as of version 2.2, domains do not start with www. so we remove them so they are compatible
    	tmp = new Array();
		tmp = JSON.parse(localStorage.urlList);
    	for(var i = 0; i < tmp.length; i++) {

	    	if(startsWith(tmp[i], "www.")) {
			    tmp[i] = tmp[i].replace("www.", "");
			}
		}
		localStorage.urlList = JSON.stringify(tmp);
		localStorage.version22 = true;
    }

    loadList();
	
	$('#add-domain').focus(function(){
		$(this).val("http://");
		$(this).css("color", "rgba(255,255,255,1)");
    });

	$('#add-domain').blur(function(){
		$(this).val("Add Website To Block");
		$(this).css("color", "rgba(0,0,0,0.4)");
	});

    $('#deleteBtn').click(function(){
    	deleteUrl();
    });

    $('#add-domain').bind("enterKey",function(e){
   		addUrl();
	});
	$('#add-domain').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});
            

});

function loadList() {
	tmp = new Array();
	tmp = JSON.parse(localStorage.urlList);

	var list = "<form name = 'url' action = '' method = 'post'>";
	list +="<div class='checkbox'>"
	 for(var i = 0;i <tmp.length; i++){
		list = list +"<div id = 'domain"+i+"'><input id='item"+i+"' type = 'checkbox' name = 'list' value = '" +i+"'/>"
				+"<label for ='item"+i+"'>"+ tmp[i] +"</label><br></div>";
	}
	list = list + "</form>";
	document.getElementById("list").innerHTML = list;
}

function startsWith(string, substr) {
    return string.substring(0,substr.length) == substr;
}

function validateNewUrl(url){
    // var pattern = /(http:\/\/)|(https:\/\/)[a-zA-Z0-9]+\.?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}/;
    // var pattern = /http(s?):\/\/([a-zA-Z])+\.([a-zA-Z0-9][a-zA-Z0-9-])+\.([a-zA-Z]{2,6})+/;
    // var pattern = /http(s?):\/\/(?:[a-zA-Z]+\.){0,1}(?:[a-zA-Z0-9][a-zA-Z0-9-]+)\.(?:[a-zA-Z]{2,6})+/;
    var pattern = /^https?:\/\/(?:www\.)?(?:[a-zA-Z0-9][a-zA-Z0-9-]+)(?=\.[a-zA-Z]{2,6})+.*$/;
    return pattern.test(url);
}

function addUrl() {
	oldList = new Array();
	var newDomain = $('#add-domain').val();
	if(newDomain == "Add Website To Block") {
		$('#add-domain').blur();
	} else {
		if(validateNewUrl(newDomain)) {
			oldList = JSON.parse(localStorage.urlList);
			oldList.push(url_domain(newDomain));
			localStorage.urlList = JSON.stringify(oldList);
			loadList();
			$('#add-domain').blur();
		} else {
			// alert("Invalid Domain");
			$('#add-domain').blur( function() {
				$('#add-domain').val("Invalid domain, where's your discipline?");
				$('#add-domain').css("color", "rgba(255,50,50,1)");
			});
			$('#add-domain').blur();
			$('#add-domain').blur(function(){
				$(this).val("Add Website To Block");
				$(this).css("color", "rgba(0,0,0,0.4)");
		    });
		}
		
	}
}
function deleteUrl(){
	oldList = new Array();
	newList = new Array();
	oldList = JSON.parse(localStorage.urlList);
	
	for(i = 0; i<document.url.list.length; i++){
		if(document.url.list[i].checked !=true){
			newList.push(oldList[i]);
		} else {
			// $("label[for='item"+i+"']").fadeOut('slow');
			// $('#item'+i).fadeOut('slow');
			$('#domain'+i).fadeOut('slow');
		}
	}
	
	delete oldList;
	localStorage.urlList = JSON.stringify(newList);
}

function url_domain(data) {
  var a = document.createElement('a');
  a.href = data;
  domain = a.hostname;
  if(startsWith(domain, "www.")){
      domain = domain.replace("www.", "");
  }
  return domain;
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
