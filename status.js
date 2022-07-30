function mainNavActiveChecker(){	
	try {
		if(/peoples/gi.test(window.location.href)){
			document.querySelector(".header-nav-item > a[href*='peoples-united']").classList.add("-parent-page");
		}	
	} catch(err){}	
}

var homepages = {
	"personal":["personal","personal-customer","personal-mortgage","customer","homebuying","home-page"],
	"business":["business","BusinessCustomer","businesscustomer"],
	"commercial":["commercial"]
}

var moveAlertBanner = function(){
	try {
		if(document.querySelectorAll(".alert-banner")[0]){
			document.querySelectorAll(".header")[0].append(document.querySelectorAll(".alert-banner")[0]);
		}			
	} catch(err){
		
	}
}
	
function DownSlider(p,k){ //p = parentSelector, k = kid selector
	try {
		var sliderParents = document.querySelectorAll(p);		
		[].forEach.call(sliderParents,function(sliderParent,i){			
			var sliderKids =  k != undefined ? document.querySelectorAll(k) : sliderParent.children;
			var allKidsHeight = 0;			
			
			var setMarginIni = function(){			
				[].forEach.call(sliderKids,function(a,b){
					allKidsHeight += Number(a.offsetHeight);
					if((b == sliderKids.length-1)  ){
						sliderParent.setAttribute("data-height",allKidsHeight+"px");
						sliderParent.style.marginTop = "-"+sliderParent.attributes["data-height"].value;
					}
				});		
			}
			
			var setOpenMargin = function(){		
				setTimeout(function(){ 
					sliderParent.style.marginTop = "0%";
					sliderParent.style.position = "relative";
					sliderParent.style.opacity = "1";						
				}, 1000);
			};
			
			setMarginIni(),setOpenMargin();	
		});
	} catch(err){}	
}

function getPageAlertHtml(){
	return "<div class='alert-banner-item _scripted' data-shadow='[[SHOWSHADOW]]' data-expire='[[TIMEEXPIRE]]'> <div class='alert-banner-item-text' tabindex='0'><p>[[ALERTTEXT]]</p></div> <button class='alert-banner-item-close' aria-label='Alert Banner Close Button'> <svg class='alert-banner-icon -mobile'> <use xlink:href='#icon-close-thin'></use> </svg> <svg class='alert-banner-icon -desktop'> <use xlink:href='#icon-close'></use> </svg> </button> </div>";
}

function getLoginAlertHtml(){
	return "<div class='login-alerts-item _scripted' data-shadow='[[SHOWSHADOW]]' data-alert-index='0' data-expire='[[TIMEEXPIRE]]'>  <div class='login-alert-text'><p>[[LOGINALERTCOPY]]</p></div>  <button class='icon-close' aria-label='Close Alert'> <svg class='icon-close'> <use xlink:href='#icon-close'></use> </svg> </button></div> ";
}

function alertActiveCheck(){
	try {		
		var today = new Date();	//new Date(new Date().toJSON().substr(0,10)+" 00:00 AM");	
		var dStart;
		var dEnd;
		var isActive;	
		var thisPage = window.location.pathname.split("/").pop().replace(/\.html/gi,"");
		var isForThispage = false;
		
		var setisForThispage = function(x){		
			if(homepages.personal.indexOf(thisPage) != -1 && (/true/gi.test(x.showonpersonalhp)) ){
				isForThispage = true;
				showAlert(x);
			}
			
			if(homepages.business.indexOf(thisPage) != -1 && (/true/gi.test(x.showonbusinesshp)) ){
				isForThispage = true;
				showAlert(x);
			}
			
			if(homepages.commercial.indexOf(thisPage) != -1 && (/true/gi.test(x.showoncommercialhp)) ){
				isForThispage = true;
				showAlert(x);
			}
			
			if(x.directurls.indexOf(thisPage) != -1 && (x.directurls.length > 0) ){
				isForThispage = true;
				showAlert(x);
			}
			if((/true/gi.test(x.showloginealert) || x.showloginealert) && !isForThispage ){
				isForThispage = true;
				showAlert(x);
			}
		}
		
		var timeActive = function(x){
			dStart = /[0-9]+/.test(x.startdate) ? new Date(x.startdate) : new Date( (Number(today.getFullYear())-1)+"-01-01 00:00 AM" );
			dEnd = /[0-9]+/.test(x.enddate) ? new Date(x.enddate) : new Date( (Number(today.getFullYear())-1)+"-01-02 00:00 AM" );
			isActive = false;
			isForThispage = false;
		
			if( today >= dStart &&  today <= dEnd){
				isActive = true;
				setisForThispage(x);
			}
		}		
		
		for(var i in allAlerts){
			timeActive(allAlerts[i]);
		}
	} catch(err){
		
	}
}

function showAlert(x){
	if( /true/gi.test(x.showpagealert) ){
		ShowPageAlert(x);
	}
	
	if( /true/gi.test(x.showloginealert)){
		ShowLoginAlert(x);
	}
}

function ShowPageAlert(a){		
	try {
		var makeAlert = function(){
			if( document.querySelectorAll(".component.alert-banner").length == 0 ){
				var alertDiv = document.createElement("div");
				alertDiv.setAttribute("class","component -no-standard-margin alert-banner");
				var hdr = document.querySelectorAll(".header")[0];
				hdr.insertBefore(alertDiv,hdr.children[0]);
			}	
			var alerParent = document.querySelector(".component.alert-banner");	
			alerParent.innerHTML += String(getPageAlertHtml()).replace("[[ALERTTEXT]]",a.alertcopy).replace("[[SHOWSHADOW]]", (/true/gi.test(a.shadow) ? "true" : "false") );
		}
		makeAlert(),DownSlider(".alert-banner");
	} catch(err){
		
	}
}

function ShowLoginAlert(a){
	try {
		if( document.querySelectorAll(".alert-login-messages").length == 0 ){
				var alertDiv = document.createElement("div");
				alertDiv.setAttribute("class","alert-login-messages");
			} else {
				var alertDiv = document.querySelector(".alert-login-messages");
			}
			
			if( document.querySelectorAll(".login-alerts").length == 0 ){
				var alertDivInner = document.createElement("div");
				alertDivInner.setAttribute("class","login-alerts");
				alertDiv.insertBefore(alertDivInner,alertDiv.children[0]);		
						
				var hdr = document.querySelectorAll(".login-scroll")[0];
				hdr.insertBefore(alertDiv,hdr.children[0]);		
			}
			
			var alerParent = document.querySelector(".login-alerts");	
			alerParent.innerHTML += String(getLoginAlertHtml()).replace("[[LOGINALERTCOPY]]",a.alertcopy);
	} catch(err){
		
	}
}

function removeBadAlerts(){
	[].forEach.call(document.querySelectorAll(".login-alerts-item"),function(a,b){
		if( /christmas/gi.test(a.innerText) ||  /clearing your browser cache/gi.test(a.innerText) ){
			a.remove();
		}	
	});
}

function fixColWhiteBg(){
	document.styleSheets[0].addRule(".columns-wrapper.-white > .column-content > .column-parsys","background-color:#ffffff;");
}

window.addEventListener("DOMContentLoaded",function(){		
	alertActiveCheck(),moveAlertBanner();
	removeBadAlerts();
	fixColWhiteBg();
	mainNavActiveChecker();
	//showMobileAlert();
	//showLoginAlert();
	
	if(/log-in/gi.test(window.location.href)){
		handleLoginAlerts();
	}
	
});


function showMobileAlert() {
	var urls = [ 
		'/personal',
		'/home-page',
		'/business'
	];
	
	if (typeof(debugAlerts) !== 'boolean') {		
		if (urls.includes(window.location.pathname) == false) return;
	}
	else {
		if (urls.includes(window.location.pathname) == false) console.log('Not an alert for this page');
	}
	
	var a = {
		"alertcopy": "We are experiencing intermittent issues with M&T Online and Mobile Banking and high call volumes. Thank you for your patience.",
		"shadow": "FALSE",
	};
	ShowPageAlert(a);	
}

function showLoginAlert() {
	var urls = [ 
		'/log-in'
	];
	
	if (typeof(debugAlerts) !== 'boolean') {		
		if (urls.includes(window.location.pathname) == false) return;
	}
	else {
		if (urls.includes(window.location.pathname) == false) console.log('Not an alert for this page');
	}
	
	var a = {
		"alertcopy": "We are experiencing intermittent issues with M&T Online and Mobile Banking and high call volumes. Thank you for your patience.",
		"shadow": "FALSE",
	};
	
	$('.alert-item p').eq(0).text(a.alertcopy);
	$('.alerts-container').removeClass('empty');
	
}
