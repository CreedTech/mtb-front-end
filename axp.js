const axp = {};

axp.setCookie = function() {
	/*
		Syntax: 
			setCookie(settings) where settings is an object with name and value (required) and any of the following optional properties defined: domain, expires, path.
			setCookie(name,value) sets a *session* cookie "name" with value "value" at the TLD
			setCookie(name,value,N) sets a cookie "name" with value "value" at the TLD, which expires in N days
			setCookie(name,value,N,settings) 
			setCookie(name,value,settings) 
			
		Returns cookie value as a string;
		
		Notes:
			Name/Value are URL-encoded unless "encode" setting is set to false			
			The "secure" flag is *always* set in this implementation.
			Optional "set" setting can be set to false to defer setting the cookie
			
	*/
	
	var def = { 
		domain: tld(),
		encode: true,
		expires: 0,
		path: '/',
		set: true		
	}
	
	var ck = {};
	
	if (arguments.length == 1 && typeof arguments[0] === 'object') Object.assign(ck, arguments[0]);
	else {
		if (typeof arguments[0] == 'string') ck.name = arguments[0];
		ck.value = String(arguments[1]);
		if (arguments.length > 2) {
			if (typeof arguments[2] === 'number') ck.expires = arguments[2];
			if (typeof arguments[2] === 'object') Object.assign(ck, arguments[2]);
		}
		if (arguments.length > 3) Object.assign(ck, arguments[3]);
		
	}
	
	if (typeof ck.name === 'undefined' || typeof ck.value === 'undefined') throw new Error('Cannot set cookie, missing name/value');
	
	ck = Object.assign(def, ck);

	if (ck.encode) { ck.name = encodeURIComponent(ck.name); ck.value = encodeURIComponent(ck.value); }
	
	var cs = ck.name + '=' + ck.value + ';';
	cs += exp(ck.expires);
	if (ck.domain != '') cs += 'domain=' + ck.domain + ';';
	if (ck.path != '') cs += 'path=' + ck.path + ';';
	cs += 'secure;';
	
	if (ck.set || typeof ck.set !== 'boolean') document.cookie = cs;
	return cs;
	
	function exp(days) {
		try {
			days = Number(days);
			if (days == 0) return '';			
			var dt = new Date();
			dt.setTime(dt.getTime() + days * 24 * 60 * 60 * 1000);
			return 'expires=' + dt.toUTCString() + ';';
		}
		catch (err) {
			console.log('Warning: Could not set cookie expiration');
			return '';
		}
	}
	
	function tld() {
		var hn = document.location.hostname.toLowerCase().split('.');
		var dn = '';
		while (hn.length > 2) hn.shift();
		return hn.join('.');
	}
}

axp.getCookie = function() {

	var def = { encode: true, decode: true, ignorecase: false };
	var ck = {};
	if (arguments.length == 1 && typeof arguments[0] === 'object') Object.assign(ck, arguments[0]);
	else {
		if (typeof arguments[0] == 'string') ck.name = arguments[0];
		if (arguments.length > 1 && typeof arguments[1]) Object.assign(ck, arguments[1]);
	}
	if (typeof ck.name === 'undefined' || ck.name == '') throw new Error('Cannot read cookie, missing name.'); 
	if (ck.encode || typeof ck.encode !== 'boolean') ck.name = encodeURIComponent(ck.name);
	var cv = document.cookie.match('(^|;)\\s*' + ck.name + '\\s*=\\s*([^;]+)');
	if (cv === null) cv = ''; else cv = cv.pop();
	if (ck.decode || typeof ck.decode !== 'boolean') cv = decodeURIComponent(cv);
	return cv;

}

axp.deleteCookie = function(name) {
	axp.setCookie(name,'',-1);
}