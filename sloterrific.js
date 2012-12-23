var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = true;
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIter
}
var Reflect = function() { }
Reflect.__name__ = true;
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
Std.__name__ = true;
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.Assets = function() {
};
co.doubleduck.Assets.__name__ = true;
co.doubleduck.Assets.loader = function() {
	if(co.doubleduck.Assets._loader == null) {
		co.doubleduck.Assets._loader = new createjs.PreloadJS();
		co.doubleduck.Assets._loader.initialize(true);
		co.doubleduck.Assets._loader.onFileLoad = co.doubleduck.Assets.handleFileLoaded;
		co.doubleduck.Assets._loader.onFileError = co.doubleduck.Assets.handleLoadError;
		co.doubleduck.Assets._loader.setMaxConnections(10);
	}
	return co.doubleduck.Assets._loader;
}
co.doubleduck.Assets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.Assets.loader().loadFile(uri);
	co.doubleduck.Assets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds[sounds.length] = "sound/music.ogg";
	sounds[sounds.length] = "sound/Theme_egypt.ogg";
	sounds[sounds.length] = "sound/Theme_italy.ogg";
	sounds[sounds.length] = "sound/Theme_france.ogg";
	sounds[sounds.length] = "sound/Theme_japan.ogg";
	sounds[sounds.length] = "sound/Theme_mexico.ogg";
	sounds[sounds.length] = "sound/Theme_usa.ogg";
	sounds[sounds.length] = "sound/wheel_stop.ogg";
	sounds[sounds.length] = "sound/level_up.ogg";
	sounds[sounds.length] = "sound/winLARGE.ogg";
	sounds[sounds.length] = "sound/winMEDIUM.ogg";
	sounds[sounds.length] = "sound/winSMALL.ogg";
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var mySound = _g1++;
			var audio = new Audio();
			audio.src = sounds[mySound];
			audio.addEventListener("canplaythrough",co.doubleduck.Assets.audioLoaded,false);
		}
	}
	manifest[manifest.length] = "images/orientation_error.png";
	manifest[manifest.length] = "images/menu/Splash.jpg";
	manifest[manifest.length] = "images/menu/tap2play.png";
	manifest[manifest.length] = "images/menu/published_by_everything_me.png";
	manifest[manifest.length] = "images/menu/background.png";
	manifest[manifest.length] = "images/menu/btn_arrow_r.png";
	manifest[manifest.length] = "images/menu/slot_1.png";
	manifest[manifest.length] = "images/menu/slot_2.png";
	manifest[manifest.length] = "images/menu/slot_3.png";
	manifest[manifest.length] = "images/menu/slot_4.png";
	manifest[manifest.length] = "images/menu/slot_5.png";
	manifest[manifest.length] = "images/menu/slot_6.png";
	manifest[manifest.length] = "images/menu/slot_locked.png";
	manifest[manifest.length] = "images/menu/funds.png";
	manifest[manifest.length] = "images/menu/getcoins_btn.png";
	manifest[manifest.length] = "images/menu/getcoins_empty.png";
	manifest[manifest.length] = "images/menu/getcoins_full.png";
	manifest[manifest.length] = "images/menu/levelbar_empty.png";
	manifest[manifest.length] = "images/menu/levelbar_full.png";
	manifest[manifest.length] = "images/menu/audio_btn.png";
	manifest[manifest.length] = "images/ui/bet.png";
	manifest[manifest.length] = "images/ui/funds.png";
	manifest[manifest.length] = "images/ui/help_btn.png";
	manifest[manifest.length] = "images/ui/lastwin.png";
	manifest[manifest.length] = "images/ui/lines.png";
	manifest[manifest.length] = "images/ui/lobby_btn.png";
	manifest[manifest.length] = "images/ui/maxlines_btn.png";
	manifest[manifest.length] = "images/ui/plusminus_btn.png";
	manifest[manifest.length] = "images/ui/totalbet.png";
	manifest[manifest.length] = "images/ui/spin_btn.png";
	manifest[manifest.length] = "images/ui/dropables.png";
	manifest[manifest.length] = "images/ui/levelup_popup.png";
	manifest[manifest.length] = "images/ui/insufficientfunds_popup.png";
	manifest[manifest.length] = "images/ui/ling/1.png";
	manifest[manifest.length] = "images/ui/ling/2.png";
	manifest[manifest.length] = "images/ui/ling/3.png";
	manifest[manifest.length] = "images/ui/ling/4.png";
	manifest[manifest.length] = "images/ui/ling/5.png";
	manifest[manifest.length] = "images/ui/ling/6.png";
	manifest[manifest.length] = "images/ui/ling/7.png";
	manifest[manifest.length] = "images/ui/ling/8.png";
	manifest[manifest.length] = "images/ui/ling/9.png";
	manifest[manifest.length] = "images/ui/ling/10.png";
	manifest[manifest.length] = "images/ui/ling/11.png";
	manifest[manifest.length] = "images/ui/ling/12.png";
	manifest[manifest.length] = "images/ui/ling/13.png";
	manifest[manifest.length] = "images/ui/ling/14.png";
	manifest[manifest.length] = "images/ui/ling/15.png";
	manifest[manifest.length] = "images/ui/ling/16.png";
	manifest[manifest.length] = "images/ui/ling/17.png";
	manifest[manifest.length] = "images/ui/ling/18.png";
	manifest[manifest.length] = "images/ui/ling/19.png";
	manifest[manifest.length] = "images/ui/ling/20.png";
	manifest[manifest.length] = "images/ui/ling/21.png";
	manifest[manifest.length] = "images/ui/ling/22.png";
	manifest[manifest.length] = "images/ui/rect/1.png";
	manifest[manifest.length] = "images/ui/rect/2.png";
	manifest[manifest.length] = "images/ui/rect/3.png";
	manifest[manifest.length] = "images/ui/rect/4.png";
	manifest[manifest.length] = "images/ui/rect/5.png";
	manifest[manifest.length] = "images/ui/rect/6.png";
	manifest[manifest.length] = "images/ui/rect/7.png";
	manifest[manifest.length] = "images/ui/rect/8.png";
	manifest[manifest.length] = "images/ui/rect/9.png";
	manifest[manifest.length] = "images/ui/rect/10.png";
	manifest[manifest.length] = "images/ui/rect/11.png";
	manifest[manifest.length] = "images/ui/rect/12.png";
	manifest[manifest.length] = "images/ui/rect/13.png";
	manifest[manifest.length] = "images/ui/rect/14.png";
	manifest[manifest.length] = "images/ui/rect/15.png";
	manifest[manifest.length] = "images/ui/rect/16.png";
	manifest[manifest.length] = "images/ui/rect/17.png";
	manifest[manifest.length] = "images/ui/rect/18.png";
	manifest[manifest.length] = "images/ui/rect/19.png";
	manifest[manifest.length] = "images/ui/rect/20.png";
	manifest[manifest.length] = "images/ui/rect/21.png";
	manifest[manifest.length] = "images/ui/rect/22.png";
	manifest[manifest.length] = "images/help/gotit_btn.png";
	manifest[manifest.length] = "images/help/page_marker.png";
	manifest[manifest.length] = "images/help/paytable.png";
	manifest[manifest.length] = "images/help/paytable_slot.png";
	manifest[manifest.length] = "images/help/rules.png";
	manifest[manifest.length] = "images/slots/france/icons.png";
	manifest[manifest.length] = "images/slots/france/background.png";
	manifest[manifest.length] = "images/slots/france/border_top.png";
	manifest[manifest.length] = "images/slots/france/border_bottom.png";
	manifest[manifest.length] = "images/slots/italy/icons.png";
	manifest[manifest.length] = "images/slots/italy/background.png";
	manifest[manifest.length] = "images/slots/italy/border_top.png";
	manifest[manifest.length] = "images/slots/italy/border_bottom.png";
	manifest[manifest.length] = "images/slots/japan/icons.png";
	manifest[manifest.length] = "images/slots/japan/background.png";
	manifest[manifest.length] = "images/slots/japan/border_top.png";
	manifest[manifest.length] = "images/slots/japan/border_bottom.png";
	manifest[manifest.length] = "images/slots/egypt/icons.png";
	manifest[manifest.length] = "images/slots/egypt/background.png";
	manifest[manifest.length] = "images/slots/egypt/border_top.png";
	manifest[manifest.length] = "images/slots/egypt/border_bottom.png";
	manifest[manifest.length] = "images/slots/usa/icons.png";
	manifest[manifest.length] = "images/slots/usa/background.png";
	manifest[manifest.length] = "images/slots/usa/border_top.png";
	manifest[manifest.length] = "images/slots/usa/border_bottom.png";
	manifest[manifest.length] = "images/slots/mexico/icons.png";
	manifest[manifest.length] = "images/slots/mexico/background.png";
	manifest[manifest.length] = "images/slots/mexico/border_top.png";
	manifest[manifest.length] = "images/slots/mexico/border_bottom.png";
	if(manifest.length == 0) {
		if(co.doubleduck.Assets.onLoadAll != null) co.doubleduck.Assets.onLoadAll();
	}
	co.doubleduck.Assets.loader().onProgress = co.doubleduck.Assets.handleProgress;
	co.doubleduck.Assets.loader().loadManifest(manifest);
	co.doubleduck.Assets.loader().load();
}
co.doubleduck.Assets.audioLoaded = function(event) {
	co.doubleduck.Assets._cacheData[event.target.src] = event.target;
}
co.doubleduck.Assets.handleProgress = function(event) {
	co.doubleduck.Assets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.Assets.loader().onProgress = null;
		co.doubleduck.Assets.onLoadAll();
	}
}
co.doubleduck.Assets.handleLoadError = function(event) {
}
co.doubleduck.Assets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.Assets._cacheData[event.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.Assets._loadCallbacks,event.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.Assets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.Assets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.Assets.loader().getResult(uri) != null) {
			cache = co.doubleduck.Assets.loader().getResult(uri).result;
			co.doubleduck.Assets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.Assets.getRawImage = function(uri) {
	var cache = co.doubleduck.Assets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.Assets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.Assets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.Assets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.Assets.prototype = {
	__class__: co.doubleduck.Assets
}
co.doubleduck.Button = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickSound == null) clickSound = "sound/button_press.ogg";
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	createjs.Container.call(this);
	this._clickSound = clickSound;
	this._bitmap = bmp;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	this.image = this._bitmap.image;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = true;
co.doubleduck.Button.__super__ = createjs.Container;
co.doubleduck.Button.prototype = $extend(createjs.Container.prototype,{
	handleEndPress: function() {
		co.doubleduck.Utils.tintBitmap(this._bitmap,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function() {
		if(this.onToggle == null) return;
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function() {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				co.doubleduck.Utils.tintBitmap(this._bitmap,0.55,0.55,0.55,1);
				var tween = createjs.Tween.get(this._bitmap);
				tween.ignoreGlobalPause = true;
				tween.wait(200).call($bind(this,this.handleEndPress));
				if(createjs.Ticker.getPaused()) co.doubleduck.Game.getStage().update();
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,addLabel: function(label) {
		var txt = co.doubleduck.FontHelper.getNumber(Std.parseInt(label));
		var width = 0;
		var height = 0;
		if(label.length == 1) {
			var digit = txt;
			width = digit.image.width * co.doubleduck.Game.getScale();
			height = digit.image.height * co.doubleduck.Game.getScale();
		} else {
			var num = txt;
			var _g1 = 0, _g = num.children.length;
			while(_g1 < _g) {
				var currDigit = _g1++;
				var digit = num.getChildAt(currDigit);
				width += digit.image.width * co.doubleduck.Game.getScale();
				height = digit.image.height * co.doubleduck.Game.getScale();
			}
		}
		txt.regX = width / 2;
		txt.regY = height / 2;
		txt.scaleX = txt.scaleY = co.doubleduck.Game.getScale();
		txt.x = this._bitmap.image.width / 2;
		txt.y = this._bitmap.image.height * 0.45 * co.doubleduck.Game.getScale();
		this.addChild(txt);
	}
	,__class__: co.doubleduck.Button
});
co.doubleduck.DataLoader = function() {
};
co.doubleduck.DataLoader.__name__ = true;
co.doubleduck.DataLoader.getSlotIconById = function(id) {
	var _g1 = 0, _g = co.doubleduck.DataLoader.getAllCountries().length;
	while(_g1 < _g) {
		var i = _g1++;
		if(co.doubleduck.DataLoader.getAllCountries()[i].id == id) return co.doubleduck.DataLoader.getAllCountries()[i];
	}
	return null;
}
co.doubleduck.DataLoader.getIconById = function(slotId,iconId) {
	var result = null;
	var slot = co.doubleduck.DataLoader.getSlotMachineById(slotId);
	var _g1 = 0, _g = slot.icons.length;
	while(_g1 < _g) {
		var icon = _g1++;
		var currIcon = slot.icons[icon];
		if(Std.parseInt(currIcon.id) == iconId) {
			result = currIcon;
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getSlotMachineById = function(id) {
	var _g1 = 0, _g = co.doubleduck.DataLoader.getAllMachines().length;
	while(_g1 < _g) {
		var i = _g1++;
		if(co.doubleduck.DataLoader.getAllMachines()[i].id == id) return co.doubleduck.DataLoader.getAllMachines()[i];
	}
	return null;
}
co.doubleduck.DataLoader.getSlotLineById = function(id) {
	var _g1 = 0, _g = co.doubleduck.DataLoader.getAllLines().length;
	while(_g1 < _g) {
		var i = _g1++;
		if(co.doubleduck.DataLoader.getAllLines()[i].id == id) return co.doubleduck.DataLoader.getAllLines()[i];
	}
	return null;
}
co.doubleduck.DataLoader.getAllMachines = function() {
	if(co.doubleduck.DataLoader._gameplayDB == null) co.doubleduck.DataLoader._gameplayDB = new GameplayDB();
	return co.doubleduck.DataLoader._gameplayDB.getAllMachines();
}
co.doubleduck.DataLoader.getAllLines = function() {
	if(co.doubleduck.DataLoader._gameplayDB == null) co.doubleduck.DataLoader._gameplayDB = new GameplayDB();
	return co.doubleduck.DataLoader._gameplayDB.getAllLines();
}
co.doubleduck.DataLoader.getAllCountries = function() {
	if(co.doubleduck.DataLoader._countryDB == null) co.doubleduck.DataLoader._countryDB = new CountryDB();
	return co.doubleduck.DataLoader._countryDB.getAllCountries();
}
co.doubleduck.DataLoader.getCountryById = function(id) {
	var result = null;
	var all = co.doubleduck.DataLoader.getAllCountries();
	var _g1 = 0, _g = all.length;
	while(_g1 < _g) {
		var curr = _g1++;
		if((all[curr].id | 0) == id) {
			result = all[curr];
			break;
		}
	}
	return result;
}
co.doubleduck.DataLoader.getLevelById = function(id) {
	var allLevels = new GameplayDB().getAllLevels();
	var _g1 = 0, _g = allLevels.length;
	while(_g1 < _g) {
		var currLevel = _g1++;
		var level = allLevels[currLevel];
		if((level.id | 0) == id) return level;
	}
	return null;
}
co.doubleduck.DataLoader.prototype = {
	__class__: co.doubleduck.DataLoader
}
co.doubleduck.Dropper = function() {
	createjs.Container.call(this);
	this._spawnHeight = co.doubleduck.Game.getViewport().y - 100;
	this._killHeight = co.doubleduck.Game.getViewport().height + 100;
	var img = co.doubleduck.Assets.getRawImage("images/ui/dropables.png");
	var initObject = { };
	initObject.images = [img];
	initObject.frames = { width : co.doubleduck.Dropper.DROPLET_SIZE, height : co.doubleduck.Dropper.DROPLET_SIZE, regX : co.doubleduck.Dropper.DROPLET_SIZE / 2, regY : co.doubleduck.Dropper.DROPLET_SIZE / 2};
	initObject.animations = { };
	var _g1 = 0, _g = co.doubleduck.Dropper.DROPLET_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		initObject.animations[co.doubleduck.Dropper.PREFIX + i] = { frames : i, frequency : 20};
	}
	co.doubleduck.Dropper._sheet = new createjs.SpriteSheet(initObject);
};
co.doubleduck.Dropper.__name__ = true;
co.doubleduck.Dropper.__super__ = createjs.Container;
co.doubleduck.Dropper.prototype = $extend(createjs.Container.prototype,{
	handleDropletDead: function(e) {
		if(this.getChildIndex(e.target) != -1) this.removeChild(e.target);
	}
	,getRandDroplet: function() {
		var droplet;
		droplet = new createjs.BitmapAnimation(co.doubleduck.Dropper._sheet);
		droplet.scaleX = droplet.scaleY = co.doubleduck.Game.getScale();
		droplet.gotoAndStop(co.doubleduck.Dropper.PREFIX + Std.random(co.doubleduck.Dropper.DROPLET_COUNT));
		return droplet;
	}
	,fireBurst: function(amount,timeInterval) {
		var interTime = Math.floor(timeInterval / amount);
		var _g = 0;
		while(_g < amount) {
			var i = _g++;
			var currDroplet = this.getRandDroplet();
			var distance = Math.random() * 0.5 + 0.25;
			currDroplet.y = this._spawnHeight;
			currDroplet.x = Math.random() * co.doubleduck.Game.getViewport().width;
			currDroplet.scaleX *= 1 - distance;
			currDroplet.scaleY *= 1 - distance;
			currDroplet.rotation = 360 * Math.random();
			createjs.Tween.get(currDroplet).wait(i * interTime).to({ y : this._killHeight},co.doubleduck.Dropper.DROP_TIME * distance).call($bind(this,this.handleDropletDead));
			this.addChild(currDroplet);
		}
	}
	,__class__: co.doubleduck.Dropper
});
co.doubleduck.FontHelper = function() {
};
co.doubleduck.FontHelper.__name__ = true;
co.doubleduck.FontHelper.tintGreen = function(src) {
	co.doubleduck.Utils.tintBitmap(src,0,1,0,1);
}
co.doubleduck.FontHelper.getPlus = function() {
	return co.doubleduck.Assets.getImage("images/font/+.png");
}
co.doubleduck.FontHelper.getComma = function() {
	return co.doubleduck.Assets.getImage("images/font/,.png");
}
co.doubleduck.FontHelper.getDollar = function() {
	return co.doubleduck.Assets.getImage("images/font/$.png");
}
co.doubleduck.FontHelper.getMinus = function(tint) {
	if(tint == null) tint = false;
	var minus = co.doubleduck.Assets.getImage("images/font/-.png");
	if(tint) co.doubleduck.FontHelper.tintGreen(minus);
	return minus;
}
co.doubleduck.FontHelper.getDigit = function(digit,greenTint) {
	if(greenTint == null) greenTint = false;
	var digit1 = co.doubleduck.Assets.getImage("images/font/" + digit + ".png");
	if(greenTint) co.doubleduck.FontHelper.tintGreen(digit1);
	return digit1;
}
co.doubleduck.FontHelper.getNumber = function(num,scale,greenTint,forceContainer) {
	if(forceContainer == null) forceContainer = false;
	if(greenTint == null) greenTint = false;
	if(scale == null) scale = 1;
	if(num >= 0 && num < 10) {
		var result = new createjs.Container();
		var bmp = co.doubleduck.FontHelper.getDigit(num);
		bmp.scaleX = bmp.scaleY = scale;
		if(greenTint) co.doubleduck.FontHelper.tintGreen(bmp);
		result.addChild(bmp);
		if(forceContainer) return result; else return bmp;
	} else {
		var result = new createjs.Container();
		var addMinus = num < 0;
		var minus = null;
		if(num < 0) {
			minus = co.doubleduck.FontHelper.getMinus();
			result.addChild(minus);
			minus.scaleX = minus.scaleY = scale;
			num = Math.abs(num) | 0;
		}
		var numString = "" + num;
		var digits = new Array();
		digits[digits.length] = co.doubleduck.FontHelper.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)),greenTint);
		digits[0].scaleX = digits[0].scaleY = scale;
		if(minus != null) digits[0].x = minus.image.width;
		result.addChild(digits[0]);
		if(numString.length == 4 || numString.length == 7) {
			co.doubleduck.FontHelper._lastComma = co.doubleduck.FontHelper.getComma();
			co.doubleduck.FontHelper._lastComma.scaleX = co.doubleduck.FontHelper._lastComma.scaleY = scale;
			co.doubleduck.FontHelper._lastComma.x = digits[0].x + digits[0].image.width;
			result.addChild(co.doubleduck.FontHelper._lastComma);
		}
		var _g1 = 1, _g = numString.length;
		while(_g1 < _g) {
			var i = _g1++;
			var index = digits.length;
			digits[index] = co.doubleduck.FontHelper.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)),greenTint);
			if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = co.doubleduck.FontHelper._lastComma.x + co.doubleduck.FontHelper._lastComma.image.width; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width;
			digits[index].scaleX = digits[index].scaleY = scale;
			result.addChild(digits[index]);
			if(numString.length - i == 4 || numString.length - i == 7) {
				co.doubleduck.FontHelper._lastComma.scaleX = co.doubleduck.FontHelper._lastComma.scaleY = scale;
				co.doubleduck.FontHelper._lastComma = co.doubleduck.FontHelper.getComma();
				if(greenTint) co.doubleduck.FontHelper.tintGreen(co.doubleduck.FontHelper._lastComma);
				co.doubleduck.FontHelper._lastComma.x = digits[index].x + digits[index].image.width;
				result.addChild(co.doubleduck.FontHelper._lastComma);
			}
		}
		return result;
	}
}
co.doubleduck.FontHelper.prototype = {
	__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this.STATE_SPLASH = 2;
	this.STATE_SESSION = 1;
	this.STATE_MENU = 0;
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		js.Lib.alert("This phone's version is not supported. please update your phone's software.");
		return;
	}
	co.doubleduck.Game._stage = stage;
	co.doubleduck.Game._stage.mouseEnabled = false;
	co.doubleduck.Game._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.Game.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	co.doubleduck.Persistence.initGameData();
	if(co.doubleduck.Game.HD) {
		co.doubleduck.Game.MAX_HEIGHT = 1281;
		co.doubleduck.Game.MAX_WIDTH = 853;
	}
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(viewporter.isLandscape()) co.doubleduck.Assets.loadAndCall("images/orientation_error.png",$bind(this,this.waitForPortrait)); else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
	} else co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
};
co.doubleduck.Game.__name__ = true;
co.doubleduck.Game.setTotalKnocks = function(num) {
	co.doubleduck.Game._totalKnocks = num;
	co.doubleduck.Persistence.setXP(num);
}
co.doubleduck.Game.getViewport = function() {
	return co.doubleduck.Game._viewport;
}
co.doubleduck.Game.getScale = function() {
	return co.doubleduck.Game._scale;
}
co.doubleduck.Game.getStage = function() {
	return co.doubleduck.Game._stage;
}
co.doubleduck.Game.setScale = function() {
	var regScale = co.doubleduck.Game._viewport.height / co.doubleduck.Game.MAX_HEIGHT;
	if(co.doubleduck.Game._viewport.width >= co.doubleduck.Game._viewport.height) co.doubleduck.Game._scale = regScale; else if(co.doubleduck.Game.MAX_WIDTH * regScale < co.doubleduck.Game._viewport.width) co.doubleduck.Game._scale = co.doubleduck.Game._viewport.width / co.doubleduck.Game.MAX_WIDTH; else co.doubleduck.Game._scale = regScale;
}
co.doubleduck.Game.prototype = {
	handleSessionEnd: function() {
		if(this._session != null) co.doubleduck.Game.setTotalKnocks(co.doubleduck.Game._totalKnocks);
	}
	,handleBackToMenu: function() {
		co.doubleduck.Game._stage.removeChild(this._session);
		this._session.destroy();
		this._session = null;
		this._state = this.STATE_MENU;
		this._menu = new co.doubleduck.Menu();
		this._menu.onStart = $bind(this,this.handleStart);
		co.doubleduck.Game._stage.addChild(this._menu);
	}
	,handleStart: function() {
		co.doubleduck.Game._stage.removeChild(this._menu);
		this._state = this.STATE_SESSION;
		this.startSession(this._menu.getChosenId() + 1);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(villageId) {
		this._session = new co.doubleduck.Session(villageId);
		this._session.setOnBackToMenu($bind(this,this.handleBackToMenu));
		co.doubleduck.Game._stage.addChild(this._session);
	}
	,handleViewportChanged: function() {
		if(viewporter.isLandscape()) {
			if(this._orientError == null) {
				this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.Game._viewport.height / 2;
				this._orientError.y = co.doubleduck.Game._viewport.width / 2;
				co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
			}
		} else if(this._orientError != null) {
			co.doubleduck.Game._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.Assets.loadAndCall("images/splash_logo.png",$bind(this,this.loadBarFill));
			}
		}
	}
	,screenResize: function() {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.Game._stage.canvas.width = screenW;
		co.doubleduck.Game._stage.canvas.height = screenH;
		if(!viewporter.isLandscape()) {
			if(isFirefox && isAndroid) {
				var viewportHeight = js.Lib.window.screen.height - 110;
				screenH = Math.ceil(viewportHeight * (screenW / js.Lib.window.screen.width));
			}
			if(!(viewporter.ACTIVE && screenH < screenW)) {
				co.doubleduck.Game._viewport.width = screenW;
				co.doubleduck.Game._viewport.height = screenH;
				co.doubleduck.Game.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.Game._stage.update();
	}
	,handleResize: function(e) {
		this.screenResize();
		co.doubleduck.Utils.waitAndCall(null,1000,$bind(this,this.screenResize));
	}
	,removeSplash: function() {
		co.doubleduck.Game._stage.removeChild(this._splashScreen);
		this._splashScreen = null;
	}
	,showMenu: function() {
		this._splashScreen.onClick = null;
		co.doubleduck.Game._stage.removeChild(this._tapToPlay);
		co.doubleduck.Game._stage.removeChild(this._evme);
		this._tapToPlay = null;
		createjs.Tween.get(this._splashScreen).to({ y : this._splashScreen.y + co.doubleduck.Game.getViewport().height},1000).call($bind(this,this.removeSplash));
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.Game._stage.addChildAt(this._menu,0);
		this._menu.onStart = $bind(this,this.handleStart);
		this._state = this.STATE_MENU;
	}
	,textAlpha: function() {
		if(this._tapToPlay == null) return;
		if(this._tapToPlay.alpha == 0) createjs.Tween.get(this._tapToPlay).to({ alpha : 1},750).call($bind(this,this.textAlpha)); else if(this._tapToPlay.alpha == 1) createjs.Tween.get(this._tapToPlay).to({ alpha : 0},1500).call($bind(this,this.textAlpha));
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.Game._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this._splashScreen = co.doubleduck.Assets.getImage("images/menu/Splash.jpg",true);
		this._splashScreen.scaleX = this._splashScreen.scaleY = co.doubleduck.Game.getScale();
		this._splashScreen.regX = this._splashScreen.image.width / 2;
		this._splashScreen.regY = this._splashScreen.image.height / 2;
		this._splashScreen.x = co.doubleduck.Game.getViewport().width / 2;
		this._splashScreen.y = co.doubleduck.Game.getViewport().height / 2;
		co.doubleduck.Game._stage.addChildAt(this._splashScreen,0);
		this._tapToPlay = co.doubleduck.Assets.getImage("images/menu/tap2play.png");
		this._tapToPlay.regX = this._tapToPlay.image.width / 2;
		this._tapToPlay.regY = this._tapToPlay.image.height / 2;
		this._tapToPlay.x = co.doubleduck.Game.getViewport().width / 2;
		this._tapToPlay.y = this._splashScreen.y + this._splashScreen.image.height * co.doubleduck.Game.getScale() * 0.32;
		this._tapToPlay.scaleX = this._tapToPlay.scaleY = co.doubleduck.Game.getScale();
		this._tapToPlay.alpha = 0;
		this.textAlpha();
		co.doubleduck.Game._stage.addChildAt(this._tapToPlay,1);
		this._splashScreen.onClick = $bind(this,this.showMenu);
		this._evme = co.doubleduck.Assets.getImage("images/menu/published_by_everything_me.png");
		this._evme.scaleX = this._evme.scaleY = co.doubleduck.Game.getScale();
		this._evme.regX = this._evme.image.width;
		this._evme.regY = this._evme.image.height * 0.90;
		this._evme.x = co.doubleduck.Game.getViewport().width;
		this._evme.y = co.doubleduck.Game.getViewport().height;
		this._evme.visible = false;
		co.doubleduck.Game._stage.addChild(this._evme);
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.Game._stage.removeChild(this._loadingBar);
		co.doubleduck.Game._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.Assets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.Assets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute();
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.Assets.getImage("images/splash_logo.png");
		this._splash.regX = this._splash.image.width / 2;
		this._splash.regY = this._splash.image.height / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		this._splash.y = 200;
		co.doubleduck.Game._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.Assets.getImage("images/loading_stroke.png");
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.Assets.getImage("images/loading_fill.png");
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.Game._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 110;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.Game._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.Game._stage.canvas.height = js.Lib.window.innerHeight;
		var bla = $bind(this,this.exitFocus);
		document.addEventListener('mozvisibilitychange', this.exitFocus);
		co.doubleduck.Game._totalKnocks = co.doubleduck.Persistence.getXP();
		if(co.doubleduck.Game._totalKnocks == null) co.doubleduck.Game.setTotalKnocks(0);
		co.doubleduck.Assets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
	}
	,waitForPortrait: function() {
		this._waitingToStart = true;
		this._orientError = co.doubleduck.Assets.getImage("images/orientation_error.png");
		this._orientError.regX = this._orientError.image.width / 2;
		this._orientError.regY = this._orientError.image.height / 2;
		this._orientError.x = js.Lib.window.innerWidth / 2;
		this._orientError.y = js.Lib.window.innerHeight / 2;
		co.doubleduck.Game._stage.addChildAt(this._orientError,co.doubleduck.Game._stage.getNumChildren());
	}
	,loadBarStroke: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_stroke.png",$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.Assets.loadAndCall("images/loading_fill.png",$bind(this,this.loadBarStroke));
	}
	,__class__: co.doubleduck.Game
}
co.doubleduck.HUD = function(slotId) {
	this.onMenuClick = null;
	createjs.Container.call(this);
	this._slotId = slotId;
	this._lastWinBox = co.doubleduck.Assets.getImage("images/ui/lastwin.png");
	this._lastWinBox.scaleX = this._lastWinBox.scaleY = co.doubleduck.Game.getScale();
	this._lastWinBox.regX = this._lastWinBox.image.width;
	this._lastWinBox.regY = this._lastWinBox.image.height / 2;
	this._lastWinBox.x = co.doubleduck.Game.getViewport().width - 3 * co.doubleduck.Game.getScale();
	this._lastWinBox.y = -((this._lastWinBox.image.height * 0.5 + 2.5) * co.doubleduck.Game.getScale());
	this.addChild(this._lastWinBox);
	var px = 22 * co.doubleduck.Game.getScale();
	this._lastWin = new createjs.Text("" + 0,"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
	this._lastWin.textAlign = "right";
	this._lastWin.regX = 0;
	this._lastWin.regY = this._lastWin.getMeasuredHeight() / 2;
	this._lastWin.y = this._lastWinBox.y;
	this._lastWin.x = this._lastWinBox.x - 10 * co.doubleduck.Game.getScale();
	this.addChild(this._lastWin);
	this._moneyBox = co.doubleduck.Assets.getImage("images/ui/funds.png");
	this._moneyBox.scaleX = this._moneyBox.scaleY = co.doubleduck.Game.getScale();
	this._moneyBox.regX = this._moneyBox.image.width;
	this._moneyBox.regY = this._moneyBox.image.height / 2;
	this._moneyBox.y = -(this._moneyBox.image.height * 0.5 * co.doubleduck.Game.getScale());
	this._moneyBox.x = this._lastWinBox.x - (this._lastWinBox.image.width + 7) * co.doubleduck.Game.getScale();
	this.addChild(this._moneyBox);
	this._money = new createjs.Text("" + 0,"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
	this._money.textAlign = "right";
	this._money.regX = 0;
	this._money.regY = this._money.getMeasuredHeight() / 2;
	this._money.y = this._moneyBox.y;
	this._money.x = this._moneyBox.x - 10 * co.doubleduck.Game.getScale();
	this.addChild(this._money);
	this._lobbyBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/ui/lobby_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
	this._lobbyBtn.regX = 0;
	this._lobbyBtn.regY = this._lobbyBtn.image.height;
	this._lobbyBtn.x = 10 * co.doubleduck.Game.getScale();
	this._lobbyBtn.y -= (this._moneyBox.image.height + 8) * co.doubleduck.Game.getScale();
	this._lobbyBtn.scaleX = this._lobbyBtn.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._lobbyBtn);
	this._lobbyBtn.onClick = $bind(this,this.handleMenuClick);
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/ui/help_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
	this._helpBtn.scaleX = this._helpBtn.scaleY = co.doubleduck.Game.getScale();
	this._helpBtn.regX = this._helpBtn.image.width;
	this._helpBtn.regY = this._helpBtn.image.height;
	this._helpBtn.y = this._lobbyBtn.y;
	this._helpBtn.x = co.doubleduck.Game.getViewport().width - 10 * co.doubleduck.Game.getScale();
	this._helpBtn.onClick = $bind(this,this.showHelp);
	this.addChild(this._helpBtn);
	this._helpScreen = new co.doubleduck.PayTable(this._slotId);
	this._helpScreen.x = co.doubleduck.Game.getViewport().width / 2;
	this._helpScreen.y = co.doubleduck.Game.getViewport().height / 2;
	this._helpScreen.visible = false;
	this._closeHelpBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/help/gotit_btn.png"));
	this._closeHelpBtn.scaleX = this._closeHelpBtn.scaleY = co.doubleduck.Game.getScale() * 1.2;
	this._closeHelpBtn.regX = this._closeHelpBtn.image.width / 2;
	this._closeHelpBtn.regY = this._closeHelpBtn.image.height;
	this._closeHelpBtn.x = co.doubleduck.Game.getViewport().width / 2;
	this._closeHelpBtn.y = this._helpScreen.y + this._helpScreen.getHeight() * 0.46 * co.doubleduck.Game.getScale();
	this._closeHelpBtn.visible = false;
	if(co.doubleduck.Game.DEBUG) {
		this._fps = new createjs.Text("0","Arial 22px","#FF0000");
		this.addChild(this._fps);
		this._fps.x = co.doubleduck.Game.getViewport().width - 100;
		this._fps.y = 250;
		createjs.Ticker.addListener(this);
	}
};
co.doubleduck.HUD.__name__ = true;
co.doubleduck.HUD.__super__ = createjs.Container;
co.doubleduck.HUD.prototype = $extend(createjs.Container.prototype,{
	removeHelpScreen: function() {
		this._helpBtn.onClick = $bind(this,this.showHelp);
		this._helpScreen.visible = false;
		co.doubleduck.Game.getStage().removeChild(this._helpScreen);
		this.mouseEnabled = true;
		if(this.onHelpClosed != null) this.onHelpClosed();
	}
	,closeHelp: function() {
		this._closeHelpBtn.onClick = null;
		this._closeHelpBtn.visible = false;
		co.doubleduck.Game.getStage().removeChild(this._closeHelpBtn);
		this._helpScreenShown = false;
		this._helpBtn.visible = true;
		this.removeHelpScreen();
	}
	,showCloseHelpButton: function() {
		co.doubleduck.Game.getStage().addChild(this._closeHelpBtn);
		this._closeHelpBtn.visible = true;
		this._closeHelpBtn.alpha = 0;
		createjs.Tween.get(this._closeHelpBtn).to({ alpha : 1},500);
		this._closeHelpBtn.onClick = $bind(this,this.closeHelp);
	}
	,showHelp: function(fade) {
		if(fade == null) fade = false;
		co.doubleduck.Game.getStage().addChild(this._helpScreen);
		this._helpScreenShown = true;
		this._helpBtn.onClick = null;
		this._helpBtn.visible = false;
		this.mouseEnabled = false;
		if(this.onHelpOpened != null) this.onHelpOpened();
		co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.showCloseHelpButton));
		this._helpScreen.visible = true;
	}
	,tick: function() {
		if(co.doubleduck.Game.DEBUG) this._fps.text = "" + createjs.Ticker.getMeasuredFPS();
	}
	,updateLastWin: function(amount) {
		this._lastWin.text = co.doubleduck.Utils.numString(amount);
	}
	,updateMoney: function(money) {
		this._money.text = co.doubleduck.Utils.numString(money);
	}
	,handleMenuClick: function() {
		if(this.onMenuClick != null) {
			createjs.Ticker.setPaused(false);
			this.onMenuClick();
		}
	}
	,__class__: co.doubleduck.HUD
});
co.doubleduck.Main = function() { }
co.doubleduck.Main.__name__ = true;
co.doubleduck.Main.main = function() {
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Menu = function() {
	this._isSweeping = false;
	this.ROW_POS = 0.39;
	this.SCROLL_EASE = 0.008;
	this.UNFOCUS_SCALE = 0.6;
	this.FOCUS_SCALE = 1;
	createjs.Container.call(this);
	this._slotsDB = new CountryDB().getAllCountries();
	this.SLOTS_COUNT = this._slotsDB.length;
	this._slotArray = new Array();
	this._locksArray = new Array();
	this._background = co.doubleduck.Assets.getImage("images/menu/background.png");
	this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
	this._background.regX = this._background.image.width / 2;
	this._background.regY = this._background.image.height / 2;
	this._background.x = co.doubleduck.Game.getViewport().width / 2;
	this._background.y = co.doubleduck.Game.getViewport().height / 2;
	var backPosY = this._background.y - this._background.image.height * co.doubleduck.Game.getScale() * 0.5;
	var backRealHeight = this._background.image.height * co.doubleduck.Game.getScale();
	this.addChildAt(this._background,0);
	this._selectRight = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_arrow_r.png"));
	this._selectRight.scaleX = this._selectRight.scaleY = co.doubleduck.Game.getScale();
	this._selectRight.regX = this._selectRight.image.width;
	this._selectRight.regY = this._selectRight.image.height / 2;
	this._selectLeft = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/btn_arrow_r.png"));
	this._selectLeft.scaleX = this._selectLeft.scaleY = co.doubleduck.Game.getScale();
	this._selectLeft.scaleX *= -1;
	this._selectLeft.regX = this._selectLeft.image.width;
	this._selectLeft.regY = this._selectLeft.image.height / 2;
	this._selectRight.x = co.doubleduck.Game.getViewport().width - 10;
	this._selectRight.y = backPosY + backRealHeight * this.ROW_POS;
	this._selectLeft.x = 10;
	this._selectLeft.y = this._selectRight.y;
	this._selectRight.onClick = $bind(this,this.handleNextSlot);
	this._selectLeft.onClick = $bind(this,this.handlePrevSlot);
	this._slotsRow = new createjs.Container();
	this._slotsRow.x = co.doubleduck.Game.getViewport().width * 0.5;
	this._slotsRow.y = backPosY + backRealHeight * this.ROW_POS;
	this.addChild(this._slotsRow);
	this.FOCUS_SCALE *= co.doubleduck.Game.getScale();
	this.UNFOCUS_SCALE *= co.doubleduck.Game.getScale();
	this._chosenSlotId = 0;
	var _g1 = 0, _g = this.SLOTS_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		this.loadSlotImage(i);
	}
	this.targetSlot(0,true);
	this.addChild(this._selectLeft);
	this.addChild(this._selectRight);
	this._levelStroke = co.doubleduck.Assets.getImage("images/menu/levelbar_empty.png");
	this._levelStroke.regX = this._levelStroke.image.width;
	this._levelStroke.regY = this._levelStroke.image.height / 2;
	this._levelStroke.x = co.doubleduck.Game.getViewport().width * 0.97;
	this._levelStroke.y = backPosY + backRealHeight * 0.67;
	this._levelStroke.scaleX = this._levelStroke.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._levelStroke);
	this._levelFill = co.doubleduck.Assets.getImage("images/menu/levelbar_full.png");
	this._levelFill.regX = this._levelFill.image.width;
	this._levelFill.regY = this._levelFill.image.height / 2;
	this._levelFill.x = this._levelStroke.x;
	this._levelFill.y = this._levelStroke.y;
	this._levelFill.scaleX = this._levelFill.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._levelFill);
	var currLevel = this.getLevel();
	var levelpx = 24 * co.doubleduck.Game.getScale();
	this._level = new createjs.Text("" + currLevel,"" + levelpx + "px Helvetica, Arial, sans-serif","#ffffff");
	this._level.textAlign = "center";
	this._level.y = this._levelFill.y - this._levelFill.image.height * 0.15 * co.doubleduck.Game.getScale();
	this._level.x = this._levelFill.x - this._levelFill.image.width * 0.875 * co.doubleduck.Game.getScale();
	this.addChild(this._level);
	this._levelMask = new createjs.Shape();
	this._levelMask.graphics.beginFill("#000000");
	this._levelMask.graphics.drawRect(0,0,this._levelFill.image.width,this._levelFill.image.height);
	this._levelMask.graphics.endFill();
	this._levelMask.regX = 0;
	this._levelMask.regY = this._levelFill.image.height / 2;
	this._levelMask.scaleX = this._levelMask.scaleY = co.doubleduck.Game.getScale();
	var levelProgression = this.getLevelProgression();
	if(levelProgression > 0) this._levelMask.scaleX *= levelProgression; else this._levelFill.visible = false;
	this._levelFill.mask = this._levelMask;
	this._levelMask.x = this._levelFill.x - this._levelFill.image.width * co.doubleduck.Game.getScale();
	this._levelMask.y = this._levelFill.y;
	this._moneyBox = co.doubleduck.Assets.getImage("images/menu/funds.png");
	this._moneyBox.regX = this._moneyBox.image.width;
	this._moneyBox.regY = this._moneyBox.image.height / 2;
	this._moneyBox.x = this._levelStroke.x;
	this._moneyBox.y = this._levelStroke.y + this._levelStroke.image.height / 2 * co.doubleduck.Game.getScale() + 25 * co.doubleduck.Game.getScale();
	this._moneyBox.scaleX = this._moneyBox.scaleY = co.doubleduck.Game.getScale();
	this.addChild(this._moneyBox);
	var px = 22 * co.doubleduck.Game.getScale();
	this._money = new createjs.Text("" + co.doubleduck.Persistence.getMoney(),"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
	this._money.textAlign = "right";
	this._money.regX = 0;
	this._money.regY = this._money.getMeasuredHeight() / 2;
	this._money.y = this._moneyBox.y;
	this._money.x = this._moneyBox.x - 12 * co.doubleduck.Game.getScale();
	this.addChild(this._money);
	px = 31 * co.doubleduck.Game.getScale();
	this._unlocksAt = new createjs.Text("0",px + "px Helvetica, Arial, sans-serif","#ffffff");
	this._unlocksAt.textAlign = "center";
	this._dropper = new co.doubleduck.Dropper();
	this.addChild(this._dropper);
	this.updateCoinCollect();
	var mutePos;
	if(this._getCoinsStroke != null) {
		mutePos = new createjs.Point(this._getCoinsStroke.x,this._getCoinsStroke.y);
		mutePos.x -= this._getCoinsStroke.image.width * co.doubleduck.Game.getScale();
	} else {
		mutePos = new createjs.Point(this._getCoinsBtn.x,this._getCoinsBtn.y);
		mutePos.x -= this._getCoinsBtn.image.width * co.doubleduck.Game.getScale();
	}
	if(co.doubleduck.SoundManager.available) {
		this._muteButton = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/audio_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this._muteButton.y = mutePos.y;
		this._muteButton.x = mutePos.x - co.doubleduck.Game.getScale() * 30;
		this._muteButton.scaleX = this._muteButton.scaleY = co.doubleduck.Game.getScale();
		this._muteButton.setToggle(!co.doubleduck.SoundManager.isMuted());
		this._muteButton.onToggle = co.doubleduck.SoundManager.toggleMute;
		this.addChild(this._muteButton);
	}
	co.doubleduck.Game.hammer.onswipe = $bind(this,this.handleSwipe);
	this._bgMusic = co.doubleduck.SoundManager.playMusic("sound/music.ogg");
};
co.doubleduck.Menu.__name__ = true;
co.doubleduck.Menu.__super__ = createjs.Container;
co.doubleduck.Menu.prototype = $extend(createjs.Container.prototype,{
	getChosenId: function() {
		return this._chosenSlotId;
	}
	,handlePlaySession: function() {
		if(this._locksArray[this._chosenSlotId] == false) {
			co.doubleduck.Game.hammer.onswipe = null;
			this.onStart();
		}
	}
	,handlePrevSlot: function() {
		if(this._chosenSlotId > 0) this.targetSlot(this._chosenSlotId - 1);
	}
	,handleNextSlot: function() {
		if(this._chosenSlotId < this.SLOTS_COUNT - 1) this.targetSlot(this._chosenSlotId + 1);
	}
	,destroy: function() {
		this._bgMusic.stop();
		this.onStart = null;
		if(this._isSweeping) createjs.Ticker.removeListener(this);
	}
	,tick: function(elapsed) {
		if(this._slotsRow.x == this._targetPos) {
			createjs.Ticker.removeListener(this);
			this._isSweeping = false;
			return;
		}
		this._slotsRow.x += (this._targetPos - this._slotsRow.x) * this.SCROLL_EASE * elapsed;
		var _g1 = 0, _g = this.SLOTS_COUNT;
		while(_g1 < _g) {
			var i = _g1++;
			var scale = this.UNFOCUS_SCALE;
			var posx = (this._slotArray[i].x + this._slotsRow.x) / co.doubleduck.Game.getViewport().width;
			if(posx >= 0.3 && posx < 0.5) scale = co.doubleduck.Utils.map(posx,0.3,0.5,this.UNFOCUS_SCALE,this.FOCUS_SCALE); else if(posx > 0.5 && posx <= 0.7) scale = co.doubleduck.Utils.map(posx,0.5,0.7,this.FOCUS_SCALE,this.UNFOCUS_SCALE); else if(posx == 0.5) scale = this.FOCUS_SCALE;
			if(i == this._chosenSlotId && this._slotArray[i].onClick == null) {
				if(posx > 0.49 && posx < 0.51) {
					this._slotArray[i].onClick = $bind(this,this.handlePlaySession);
					if(this._locksArray[i]) {
						this._unlocksAt.text = this._slotsDB[i].levelToUnlock + "";
						this._unlocksAt.x = this._slotArray[i].x;
						this._unlocksAt.y = this._slotArray[i].y + 52 * co.doubleduck.Game.getScale();
						this._slotsRow.addChild(this._unlocksAt);
					}
				}
			}
			this._slotArray[i].scaleX = this._slotArray[i].scaleY = scale;
		}
	}
	,targetSlot: function(id,force) {
		if(force == null) force = false;
		this._slotArray[this._chosenSlotId].onClick = null;
		this._chosenSlotId = id;
		this._targetPos = co.doubleduck.Game.getViewport().width / 2 - this._slotArray[id].x;
		if(id == 0) this._selectLeft.visible = false; else this._selectLeft.visible = true;
		if(id == this.SLOTS_COUNT - 1) this._selectRight.visible = false; else this._selectRight.visible = true;
		if(force) {
			this._isSweeping = false;
			this._slotsRow.x = this._targetPos;
			this._slotArray[id].scaleX = this._slotArray[id].scaleY = this.FOCUS_SCALE;
			this._slotArray[this._chosenSlotId].onClick = $bind(this,this.handlePlaySession);
		} else {
			if(this._slotsRow.getChildIndex(this._unlocksAt) != -1) this._slotsRow.removeChild(this._unlocksAt);
			this._isSweeping = true;
			createjs.Ticker.addListener(this);
		}
	}
	,loadSlotImage: function(id) {
		if(id < 0 || id > 99 || id >= this.SLOTS_COUNT) return;
		var uriImage;
		if(this.getLevel() < this._slotsDB[id].levelToUnlock) {
			this._locksArray[id] = true;
			uriImage = "images/menu/slot_locked.png";
		} else {
			this._locksArray[id] = false;
			uriImage = "images/menu/slot_" + (id + 1) + ".png";
		}
		this._slotArray[id] = co.doubleduck.Assets.getImage(uriImage,true);
		this._slotArray[id].regX = this._slotArray[id].image.width / 2;
		this._slotArray[id].regY = this._slotArray[id].image.height / 2;
		this._slotArray[id].scaleX = this._slotArray[id].scaleY = this.UNFOCUS_SCALE;
		this._slotArray[id].x = id * (co.doubleduck.Game.getViewport().width / 2);
		this._slotArray[id].y = 0;
		this._slotsRow.addChild(this._slotArray[id]);
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextSlot(); else if(event.direction == "right") this.handlePrevSlot();
	}
	,getLevel: function() {
		var xp = co.doubleduck.Persistence.getXP();
		var _gameplayDb = new GameplayDB();
		var allLevels = _gameplayDb.getAllLevels();
		var _g1 = 0, _g = allLevels.length;
		while(_g1 < _g) {
			var currLevel = _g1++;
			if((allLevels[currLevel].xpToUnlock | 0) > xp) return allLevels[currLevel - 1].id | 0;
		}
		return allLevels[allLevels.length - 1].id | 0;
	}
	,getLevelProgression: function() {
		var currLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel());
		var nextLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel() + 1);
		if(nextLevel == null) return 1;
		var all = (nextLevel.xpToUnlock | 0) - (currLevel.xpToUnlock | 0);
		var delta = co.doubleduck.Persistence.getXP() - (currLevel.xpToUnlock | 0);
		return delta / all;
	}
	,handleGetCoins: function() {
		var money = co.doubleduck.Persistence.getMoney() + new GameplayDB().coinGetAmount;
		co.doubleduck.Persistence.setMoney(money);
		this._money.text = "" + money;
		var now = new Date().getTime();
		co.doubleduck.Persistence.setCoinTime(now);
		this.removeChild(this._getCoinsBtn);
		this._getCoinsBtn = null;
		this.showNextCoinIn();
		this._dropper.fireBurst(30,600);
		co.doubleduck.SoundManager.playEffect("sound/winLARGE.ogg");
	}
	,showGetCoinsButton: function() {
		this._getCoinsBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/menu/getcoins_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._getCoinsBtn.regX = this._getCoinsBtn.image.width;
		this._getCoinsBtn.regY = this._getCoinsBtn.image.height / 2;
		this._getCoinsBtn.x = this._moneyBox.x;
		this._getCoinsBtn.y = this._moneyBox.y + this._moneyBox.image.height * co.doubleduck.Game.getScale() * 0.5 + 30 * co.doubleduck.Game.getScale();
		this._getCoinsBtn.scaleX = this._getCoinsBtn.scaleY = co.doubleduck.Game.getScale();
		this._getCoinsBtn.onClick = $bind(this,this.handleGetCoins);
		this.addChildAt(this._getCoinsBtn,this.getChildIndex(this._dropper));
	}
	,coinTimer: function() {
		var now = new Date().getTime();
		var interval = new GameplayDB().coinGetInterval;
		var nextCoinTime = (co.doubleduck.Persistence.getCoinTime() + interval * 1000 - now | 0) / 1000 | 0;
		if(nextCoinTime > 0) {
			var mins = nextCoinTime / 60 | 0;
			var secs = nextCoinTime % 60;
			var minString = "" + mins;
			var secString = "" + secs;
			if(mins < 10) minString = "0" + mins;
			if(secs < 10) secString = "0" + secs;
			this._coinsIn.text = "Coins In: " + minString + ":" + secString;
			this._getCoinsMask.scaleX = co.doubleduck.Game.getScale() * ((interval - nextCoinTime) / interval);
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.coinTimer));
		} else {
			this.removeChild(this._getCoinsStroke);
			this.removeChild(this._getCoinsFill);
			this.removeChild(this._coinsIn);
			this._coinsIn = null;
			this._getCoinsStroke = null;
			this._getCoinsMask = null;
			this._getCoinsFill = null;
			this.showGetCoinsButton();
		}
	}
	,showNextCoinIn: function() {
		this._getCoinsStroke = co.doubleduck.Assets.getImage("images/menu/getcoins_empty.png");
		this._getCoinsStroke.regX = this._getCoinsStroke.image.width;
		this._getCoinsStroke.regY = this._getCoinsStroke.image.height / 2;
		this._getCoinsStroke.scaleX = this._getCoinsStroke.scaleY = co.doubleduck.Game.getScale();
		this.addChildAt(this._getCoinsStroke,this.getChildIndex(this._dropper));
		this._getCoinsStroke.x = this._moneyBox.x;
		this._getCoinsStroke.y = this._moneyBox.y + this._moneyBox.image.height * co.doubleduck.Game.getScale() * 0.5 + 30 * co.doubleduck.Game.getScale();
		this._getCoinsFill = co.doubleduck.Assets.getImage("images/menu/getcoins_full.png");
		this._getCoinsFill.regX = this._getCoinsFill.image.width;
		this._getCoinsFill.regY = this._getCoinsFill.image.height / 2;
		this._getCoinsFill.scaleX = this._getCoinsFill.scaleY = co.doubleduck.Game.getScale();
		this.addChildAt(this._getCoinsFill,this.getChildIndex(this._dropper));
		this._getCoinsFill.x = this._moneyBox.x;
		this._getCoinsFill.y = this._moneyBox.y + this._moneyBox.image.height * co.doubleduck.Game.getScale() * 0.5 + 30 * co.doubleduck.Game.getScale();
		this._getCoinsMask = new createjs.Shape();
		this._getCoinsMask.graphics.beginFill("#000000");
		this._getCoinsMask.graphics.drawRect(0,0,this._getCoinsFill.image.width,this._getCoinsFill.image.height);
		this._getCoinsMask.graphics.endFill();
		this._getCoinsMask.scaleX = this._getCoinsMask.scaleY = co.doubleduck.Game.getScale();
		this._getCoinsMask.x = this._getCoinsFill.x - this._getCoinsFill.image.width * co.doubleduck.Game.getScale();
		this._getCoinsMask.y = this._getCoinsFill.y - this._getCoinsFill.image.height * 0.5 * co.doubleduck.Game.getScale();
		this._getCoinsFill.mask = this._getCoinsMask;
		var px = 16 * co.doubleduck.Game.getScale();
		this._coinsIn = new createjs.Text("","" + px + "px Helvetica, Arial, sans-serif","#222222");
		this._coinsIn.textAlign = "center";
		this._coinsIn.regY = this._coinsIn.getMeasuredHeight() / 2;
		this._coinsIn.y = this._getCoinsFill.y;
		this._coinsIn.x = this._getCoinsFill.x - this._getCoinsFill.image.width * 0.5 * co.doubleduck.Game.getScale();
		this.addChildAt(this._coinsIn,this.getChildIndex(this._dropper));
		this.coinTimer();
	}
	,updateCoinCollect: function() {
		var now = new Date().getTime();
		var interval = new GameplayDB().coinGetInterval;
		var nextCoinTime = co.doubleduck.Persistence.getCoinTime() + interval * 1000 - now | 0;
		if(nextCoinTime > 0) this.showNextCoinIn(); else this.showGetCoinsButton();
	}
	,handleMuteToggle: function(flag) {
		null;
	}
	,__class__: co.doubleduck.Menu
});
co.doubleduck.PayTable = function(slotId) {
	this._slotId = slotId;
	createjs.Container.call(this);
	this._tableBackground = co.doubleduck.Assets.getImage("images/help/paytable.png");
	this._mask = new createjs.Shape();
	this._mask.graphics.beginFill("#000000");
	this._mask.graphics.drawRect(20,20,this._tableBackground.image.width - 40,this._tableBackground.image.height - 40);
	this._mask.graphics.endFill();
	this.addChild(this._tableBackground);
	this.regX = this._tableBackground.image.width / 2;
	this.regY = this._tableBackground.image.height / 2;
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.initSlots();
	this._rules = co.doubleduck.Assets.getImage("images/help/rules.png");
	this._rules.regX = this._rules.image.width / 2;
	this._rules.regY = this._rules.image.height / 2;
	this._rules.x = this._tableBackground.image.width / 2;
	this._rules.y = this._tableBackground.image.height * 0.4;
	this._slots.addChild(this._rules);
	this._slots.mask = this._mask;
	this._currPage = 1;
	this.enableSwipe();
	this.addPageMarkers();
};
co.doubleduck.PayTable.__name__ = true;
co.doubleduck.PayTable.__super__ = createjs.Container;
co.doubleduck.PayTable.prototype = $extend(createjs.Container.prototype,{
	createPageMarker: function() {
		var img = co.doubleduck.Assets.getRawImage("images/help/page_marker.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : 16, height : 18};
		initObject.animations = { };
		initObject.animations.idle = { frames : [0], frequency : 1, next : false};
		initObject.animations.active = { frames : [1], frequency : 1, next : "false"};
		var spritesheet = new createjs.SpriteSheet(initObject);
		var pageMarker = new createjs.BitmapAnimation(spritesheet);
		pageMarker.gotoAndStop("idle");
		return pageMarker;
	}
	,handleNextClick: function() {
		this._currPage += 1;
		if(this._currPage > this._pageNum) {
			this._currPage = this._pageNum;
			return;
		}
		this._pageMarkers[this._currPage - 2].gotoAndStop("idle");
		this._pageMarkers[this._currPage - 1].gotoAndStop("active");
		createjs.Tween.get(this._slots).to({ x : -1 * this._tableBackground.image.width * (this._currPage - 1)},200,createjs.Ease.sineOut);
	}
	,handlePrevClick: function() {
		this._currPage -= 1;
		if(this._currPage < 1) {
			this._currPage = 1;
			return;
		}
		this._pageMarkers[this._currPage].gotoAndStop("idle");
		this._pageMarkers[this._currPage - 1].gotoAndStop("active");
		createjs.Tween.get(this._slots).to({ x : -1 * this._tableBackground.image.width * (this._currPage - 1)},200,createjs.Ease.sineOut);
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextClick(); else if(event.direction == "right") this.handlePrevClick();
	}
	,enableSwipe: function() {
		co.doubleduck.Game.hammer.onswipe = $bind(this,this.handleSwipe);
	}
	,createSlot: function(iconId) {
		var slot = new createjs.Container();
		var slotBg = co.doubleduck.Assets.getImage("images/help/paytable_slot.png");
		slotBg.regX = slotBg.image.width / 2;
		slotBg.regY = slotBg.image.height / 2;
		slot.addChild(slotBg);
		var icon = new co.doubleduck.SlotIcon(this._slotId,iconId);
		icon.y -= slotBg.image.height * 0.20;
		slot.addChild(icon);
		if(iconId == 1) {
			var wildcard = new createjs.Text("Wildcard","bold 14px Arial","#000000");
			wildcard.textAlign = "center";
			wildcard.y = slotBg.image.height * 0.18;
			slot.addChild(wildcard);
			return slot;
		}
		var iconData = co.doubleduck.DataLoader.getIconById(this._slotId,iconId);
		var minSequence = iconData.minForSequence | 0;
		var multipliers = iconData.multipliers;
		var _g1 = 0, _g = multipliers.length;
		while(_g1 < _g) {
			var currMultiplier = _g1++;
			var totalWidth = 0;
			var textBold = new createjs.Text("" + (minSequence + currMultiplier | 0),"bold 14px Arial","#000000");
			var textNotBold = new createjs.Text(" - x " + (multipliers[currMultiplier] | 0),"14px Arial","#000000");
			textNotBold.x = textBold.getMeasuredWidth();
			totalWidth += textBold.getMeasuredWidth();
			totalWidth += textNotBold.getMeasuredWidth();
			var textContainer = new createjs.Container();
			textContainer.addChild(textBold);
			textContainer.addChild(textNotBold);
			textContainer.regX = 0;
			textContainer.x -= 30;
			textContainer.y = slotBg.image.height * 0.05 + slotBg.image.height * 0.09 * currMultiplier;
			slot.addChild(textContainer);
		}
		return slot;
	}
	,initSlots: function() {
		this._slots = new createjs.Container();
		var iconNum = co.doubleduck.DataLoader.getSlotMachineById(this._slotId).icons.length | 0;
		this._pageNum = (iconNum / 6 | 0) + 2;
		var _g1 = 0, _g = this._pageNum;
		while(_g1 < _g) {
			var currPage = _g1++;
			var _g2 = 0;
			while(_g2 < 2) {
				var currRow = _g2++;
				var _g3 = 0;
				while(_g3 < 3) {
					var currCol = _g3++;
					var index = 3 * currRow + currCol + 6 * currPage;
					if(index >= iconNum) break; else {
						var onlySlot = this.createSlot(index + 1);
						onlySlot.x = this._tableBackground.image.width * 0.20 + this._tableBackground.image.width * 0.3 * currCol;
						onlySlot.y = this._tableBackground.image.height * 0.22 + this._tableBackground.image.height * 0.37 * currRow;
						this._slots.addChild(onlySlot);
						onlySlot.x += this._tableBackground.image.width + this._tableBackground.image.width * currPage;
					}
				}
			}
		}
		this.addChild(this._slots);
	}
	,getHeight: function() {
		return this._tableBackground.image.height;
	}
	,addPageMarkers: function() {
		this._pageMarkers = new Array();
		var totalWidth = 0;
		var markerContainer = new createjs.Container();
		var _g1 = 0, _g = this._pageNum;
		while(_g1 < _g) {
			var currPage = _g1++;
			var pageMarker = this.createPageMarker();
			this._pageMarkers.push(pageMarker);
			if(currPage != 0) {
				pageMarker.x = this._pageMarkers[currPage - 1].x + this._pageMarkers[currPage - 1].spriteSheet._frameWidth + 5;
				totalWidth += 5;
			}
			totalWidth += pageMarker.spriteSheet._frameWidth;
			markerContainer.addChild(pageMarker);
		}
		markerContainer.y = this._tableBackground.image.height * 0.80;
		markerContainer.x = this._tableBackground.image.width / 2;
		markerContainer.regX = totalWidth / 2;
		this.addChild(markerContainer);
		this._pageMarkers[0].gotoAndStop("active");
	}
	,__class__: co.doubleduck.PayTable
});
co.doubleduck.Persistence = function() {
};
co.doubleduck.Persistence.__name__ = true;
co.doubleduck.Persistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.Persistence.getValue = function(key) {
	if(!co.doubleduck.Persistence.available) return "0";
	var val = localStorage[co.doubleduck.Persistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.Persistence.setValue = function(key,value) {
	if(!co.doubleduck.Persistence.available) return;
	localStorage[co.doubleduck.Persistence.GAME_PREFIX + key] = value;
}
co.doubleduck.Persistence.clearAll = function() {
	if(!co.doubleduck.Persistence.available) return;
	localStorage.clear();
}
co.doubleduck.Persistence.initGameData = function() {
	if(!co.doubleduck.Persistence.available) return;
	co.doubleduck.Persistence.initVar("xp");
	co.doubleduck.Persistence.initVar("money");
	co.doubleduck.Persistence.initVar("coinTime");
	if(co.doubleduck.Persistence.getXP() == 0) co.doubleduck.Persistence.setMoney(1000);
	if(co.doubleduck.Persistence.getCoinTime() == 0) {
		var now = new Date().getTime();
		now -= 10000000;
		co.doubleduck.Persistence.setCoinTime(now);
	}
}
co.doubleduck.Persistence.setCoinTime = function(time) {
	co.doubleduck.Persistence.setValue("coinTime","" + time);
}
co.doubleduck.Persistence.getCoinTime = function() {
	return Std.parseFloat(co.doubleduck.Persistence.getValue("coinTime"));
}
co.doubleduck.Persistence.setXP = function(xp) {
	co.doubleduck.Persistence.setValue("xp","" + xp);
}
co.doubleduck.Persistence.getXP = function() {
	return Std.parseInt(co.doubleduck.Persistence.getValue("xp"));
}
co.doubleduck.Persistence.setMoney = function(money) {
	co.doubleduck.Persistence.setValue("money","" + money);
}
co.doubleduck.Persistence.getMoney = function() {
	return Std.parseInt(co.doubleduck.Persistence.getValue("money"));
}
co.doubleduck.Persistence.initVar = function(initedVar) {
	var value = co.doubleduck.Persistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.Persistence.setValue(initedVar,"0");
	} catch( e ) {
		co.doubleduck.Persistence.available = false;
	}
}
co.doubleduck.Persistence.prototype = {
	__class__: co.doubleduck.Persistence
}
co.doubleduck.Session = function(slotID) {
	createjs.Container.call(this);
	this._slotID = slotID;
	this._slot = co.doubleduck.DataLoader.getSlotMachineById(slotID);
	this._availableLines = this._slot.lines;
	this._betValues = this._slot.betValues;
	this._lineOptions = this._slot.lineOptions;
	this._betOption = 0;
	this._betAmount = this._betValues[this._betOption];
	this._lineOption = 0;
	this._numLines = this._lineOptions[this._lineOption];
	this.constructLevel();
	this._hud = new co.doubleduck.HUD(this._slotID);
	this._hud.y = this._machine.y - (this._machine.getHeight() / 2 + 40) * co.doubleduck.Game.getScale();
	this.addChild(this._hud);
	this._hud.updateMoney(co.doubleduck.Persistence.getMoney());
	this._hud.onHelpClosed = $bind(this,this.handleHelpClosed);
	this._hud.onHelpOpened = $bind(this,this.handleHelpOpened);
	this._dropper = new co.doubleduck.Dropper();
	this.addChild(this._dropper);
	var minMultiplier = 99999;
	var maxMultiplier = 0;
	var _g1 = 0, _g = this._slot.icons.length;
	while(_g1 < _g) {
		var currIcon = _g1++;
		var icon = this._slot.icons[currIcon];
		if(icon.id == "1") continue;
		var numMultiplier = icon.multipliers.length | 0;
		if((icon.multipliers[0] | 0) < minMultiplier) minMultiplier = icon.multipliers[0] | 0;
		if((icon.multipliers[numMultiplier - 1] | 0) > maxMultiplier) maxMultiplier = icon.multipliers[numMultiplier - 1] | 0;
	}
	this._minBet = minMultiplier * this._betValues[0];
	this._maxBet = maxMultiplier * this._betValues[this._betValues.length - 1];
	var avgLine = this._lineOptions[Math.floor(this._lineOptions.length / 2)];
	this._maxBet *= avgLine;
};
co.doubleduck.Session.__name__ = true;
co.doubleduck.Session.__super__ = createjs.Container;
co.doubleduck.Session.prototype = $extend(createjs.Container.prototype,{
	updateTotalBet: function() {
		this._totalBet = this._numLines * this._betAmount;
		this._totalBetDisplay.text = "" + this._totalBet;
	}
	,getScore: function() {
		return 0;
	}
	,setOnBackToMenu: function(cb) {
		this.onBackToMenu = cb;
		this._hud.onMenuClick = cb;
	}
	,destroy: function() {
		if(this._currPlaying != null) this._currPlaying.stop();
		createjs.Ticker.removeListener(this);
		this.onBackToMenu = null;
	}
	,decreaseBetValue: function() {
		if(this._betOption == 0) return;
		this._betOption -= 1;
		this._betAmount = this._betValues[this._betOption];
		this._betValueDisplay.text = "" + this._betAmount;
		this.updateTotalBet();
	}
	,increaseBetValue: function() {
		if(this._betOption == this._betValues.length - 1) return;
		if(this._betValues[this._betOption + 1] * this._numLines > co.doubleduck.Persistence.getMoney()) {
			this.notEnoughMoney();
			return;
		}
		this._betOption += 1;
		this._betAmount = this._betValues[this._betOption];
		this._betValueDisplay.text = "" + this._betAmount;
		this.updateTotalBet();
	}
	,updateDisplayedLines: function() {
		var lineIds = new Array();
		var _g1 = 0, _g = this._numLines;
		while(_g1 < _g) {
			var currLine = _g1++;
			lineIds[lineIds.length] = this._availableLines[currLine];
		}
		this._slotLines.enableLines(lineIds);
	}
	,decreaseLineAmount: function() {
		if(this._lineOption == 0) {
			this.updateDisplayedLines();
			return;
		}
		this._lineOption -= 1;
		this._numLines = this._lineOptions[this._lineOption];
		this._lineAmountDisplay.text = "" + this._numLines;
		this.updateTotalBet();
		this.updateDisplayedLines();
	}
	,increaseLineAmount: function() {
		if(this._lineOption == this._lineOptions.length - 1) {
			this.updateDisplayedLines();
			return;
		}
		if(this._betAmount * this._lineOptions[this._lineOption + 1] > co.doubleduck.Persistence.getMoney()) {
			this.notEnoughMoney();
			return;
		}
		this._lineOption += 1;
		this._numLines = this._lineOptions[this._lineOption];
		this._lineAmountDisplay.text = "" + this._numLines;
		this.updateTotalBet();
		this.updateDisplayedLines();
	}
	,enableUI: function() {
		this._spinButton.mouseEnabled = true;
		this._spinButton.idle();
		this._betValueBtn.alpha = 1;
		this._betValueBtn.mouseEnabled = true;
		this._lineAmountBtn.alpha = 1;
		this._lineAmountBtn.mouseEnabled = true;
		this._maxLinesBtn.mouseEnabled = true;
		this._maxLinesBtn.alpha = 1;
	}
	,disableUI: function() {
		this._spinButton.mouseEnabled = false;
		this._spinButton.clicked();
		this._betValueBtn.alpha = 0.8;
		this._betValueBtn.mouseEnabled = false;
		this._lineAmountBtn.alpha = 0.8;
		this._lineAmountBtn.mouseEnabled = false;
		this._maxLinesBtn.mouseEnabled = false;
		this._maxLinesBtn.alpha = 0.8;
	}
	,addMoney: function(money) {
		var currBalance = co.doubleduck.Persistence.getMoney();
		currBalance += money;
		co.doubleduck.Persistence.setMoney(currBalance);
		this._hud.updateMoney(currBalance);
	}
	,decreaseBetIfNeeded: function() {
		while(this._betAmount * this._numLines > co.doubleduck.Persistence.getMoney()) if(this._lineOption > 0) this.decreaseLineAmount(); else if(this._betOption > 0) this.decreaseBetValue(); else break;
	}
	,handleRollResult: function(winningLines,lines) {
		var lastWin = 0;
		var _g1 = 0, _g = winningLines.length;
		while(_g1 < _g) {
			var winningLine = _g1++;
			var currWinningLine = winningLines[winningLine];
			var index = co.doubleduck.SlotMachine.getFirstNonJokerIndex(currWinningLine);
			var winningIcon = currWinningLine[index];
			var iconData = co.doubleduck.DataLoader.getIconById(this._slotID,winningIcon.getId());
			var multiplierIndex = currWinningLine.length - iconData.minForSequence;
			var multiplier = iconData.multipliers[multiplierIndex];
			this.addMoney(this._betAmount * multiplier);
			lastWin += this._betAmount * multiplier;
			var numDropables = co.doubleduck.Utils.map(lastWin,this._minBet,this._maxBet * co.doubleduck.Session.MAX_DROP_THRESH,8,50);
			var time = co.doubleduck.Utils.map(numDropables,3,120,400,1800);
			var soundSize = Math.floor(co.doubleduck.Utils.map(lastWin,this._minBet,this._maxBet * co.doubleduck.Session.MAX_DROP_THRESH,1,3.99)) | 0;
			var effectName = "sound/win";
			switch(soundSize) {
			case 1:
				effectName += "SMALL";
				break;
			case 2:
				effectName += "MEDIUM";
				break;
			case 3:
				effectName += "LARGE";
				break;
			}
			effectName += ".ogg";
			this._dropper.fireBurst(numDropables | 0,time | 0);
			this._currPlaying = co.doubleduck.SoundManager.playEffect(effectName);
		}
		if(lines.length > 0) this._slotLines.displayWinningLines(lines,winningLines);
		if(lastWin > 0) this._hud.updateLastWin(lastWin);
		this.decreaseBetIfNeeded();
		if(this._leveledUp) this.showLevelUp(); else this.enableUI();
	}
	,removeXpText: function() {
		this.removeChild(this._gotXpText);
	}
	,getLevel: function() {
		var xp = co.doubleduck.Persistence.getXP();
		var _gameplayDb = new GameplayDB();
		var allLevels = _gameplayDb.getAllLevels();
		var _g1 = 0, _g = allLevels.length;
		while(_g1 < _g) {
			var currLevel = _g1++;
			if((allLevels[currLevel].xpToUnlock | 0) > xp) return allLevels[currLevel - 1].id | 0;
		}
		return allLevels[allLevels.length - 1].id | 0;
	}
	,machineRoll: function() {
		var countryName = co.doubleduck.DataLoader.getCountryById(this._slotID).name;
		this._currPlaying = co.doubleduck.SoundManager.playMusic("sound/Theme_" + countryName + ".ogg",1,false);
		var rollLineIds = new Array();
		var _g1 = 0, _g = this._numLines;
		while(_g1 < _g) {
			var currLine = _g1++;
			rollLineIds.push(this._availableLines[currLine]);
		}
		this._slotLines.hideLines();
		this._machine.startRoll(rollLineIds);
	}
	,removeLevelUpGfx: function() {
		this.removeChild(this._levelUpGfx);
		this._levelUpGfx = null;
		this.enableUI();
	}
	,endLevelUp: function() {
		this.removeChild(this._levelTxt);
		this._levelTxt = null;
		createjs.Tween.get(this._levelUpGfx).to({ y : co.doubleduck.Game.getViewport().height + this._levelUpGfx.image.height * 0.5 * co.doubleduck.Game.getScale()},1000,createjs.Ease.sineOut).call($bind(this,this.removeLevelUpGfx));
	}
	,levelUpTxt: function() {
		var px = 42 * co.doubleduck.Game.getScale();
		this._levelTxt = new createjs.Text("" + this.getLevel(),"" + px + "px Helvetica, Arial, sans-serif","#ffffff");
		this._levelTxt.textAlign = "center";
		this._levelTxt.y = this._levelUpGfx.y - this._levelUpGfx.image.height * 0.75 * co.doubleduck.Game.getScale() / 2;
		this._levelTxt.x = this._levelUpGfx.x;
		this._levelTxt.alpha = 0;
		createjs.Tween.get(this._levelTxt).to({ alpha : 1},700).wait(1000).call($bind(this,this.endLevelUp));
		this.addChild(this._levelTxt);
	}
	,showLevelUp: function() {
		this._spinButton.idle();
		this._levelUpGfx = co.doubleduck.Assets.getImage("images/ui/levelup_popup.png");
		this._levelUpGfx.regX = this._levelUpGfx.image.width / 2;
		this._levelUpGfx.regY = this._levelUpGfx.image.height / 2;
		this._levelUpGfx.x = co.doubleduck.Game.getViewport().width / 2;
		this._levelUpGfx.y = -this._levelUpGfx.image.height * co.doubleduck.Game.getScale() / 2;
		this._levelUpGfx.alpha = 1;
		this._levelUpGfx.scaleX = this._levelUpGfx.scaleY = co.doubleduck.Game.getScale();
		createjs.Tween.get(this._levelUpGfx).to({ y : co.doubleduck.Game.getViewport().height / 2},1000,createjs.Ease.bounceOut).wait(500).call($bind(this,this.levelUpTxt));
		co.doubleduck.SoundManager.playEffect("sound/level_up.ogg");
		this.addChild(this._levelUpGfx);
	}
	,removeNotEnoughMoney: function() {
		this.removeChild(this._noMoney);
	}
	,notEnoughMoney: function() {
		if(this._noMoney != null && this._noMoney.alpha != 0) return;
		this._noMoney = co.doubleduck.Assets.getImage("images/ui/insufficientfunds_popup.png");
		this._noMoney.regX = this._noMoney.image.width / 2;
		this._noMoney.regY = this._noMoney.image.height / 2;
		this._noMoney.scaleX = this._noMoney.scaleY = co.doubleduck.Game.getScale();
		this.addChild(this._noMoney);
		this._noMoney.alpha = 0;
		this._noMoney.x = co.doubleduck.Game.getViewport().width / 2;
		this._noMoney.y = co.doubleduck.Game.getViewport().height / 2;
		createjs.Tween.get(this._noMoney).to({ alpha : 1},500,createjs.Ease.sineOut).wait(1000).to({ alpha : 0},500,createjs.Ease.sineIn).call($bind(this,this.removeNotEnoughMoney));
	}
	,handleRollClick: function() {
		if(this._betAmount * this._numLines > co.doubleduck.Persistence.getMoney()) {
			this.notEnoughMoney();
			return;
		}
		this.disableUI();
		var totalBet = this._betAmount * this._numLines;
		var newMoney = co.doubleduck.Persistence.getMoney() - totalBet;
		co.doubleduck.Persistence.setMoney(newMoney);
		this._hud.updateMoney(newMoney);
		var oldLevel = this.getLevel();
		co.doubleduck.Persistence.setXP(co.doubleduck.Persistence.getXP() + totalBet);
		var newLevel = this.getLevel();
		this._leveledUp = newLevel > oldLevel;
		this.machineRoll();
		this._gotXpText.y = this._spinButton.y;
		this._gotXpText.x = this._spinButton.x - this._spinButton.spriteSheet._frameWidth / 2 * co.doubleduck.Game.getScale();
		this._gotXpText.text = "+" + totalBet + "XP";
		this._gotXpText.alpha = 1;
		this.addChild(this._gotXpText);
		createjs.Tween.get(this._gotXpText).to({ y : this._gotXpText.y - 200 * co.doubleduck.Game.getScale(), alpha : 0.5},800).call($bind(this,this.removeXpText));
	}
	,handleMaxLines: function() {
		this._lineOption = this._lineOptions.length - 1;
		this._numLines = this._lineOptions[this._lineOption];
		this._lineAmountDisplay.text = "" + this._numLines;
		this.decreaseBetIfNeeded();
		this.updateTotalBet();
		this.updateDisplayedLines();
	}
	,handleLineAmountClick: function(e) {
		var globalHalf = this._lineAmountBtn.localToGlobal(this._lineAmountBtn.image.width / 2,0);
		if(e.stageX > globalHalf.x) this.increaseLineAmount(); else this.decreaseLineAmount();
	}
	,handleBetValueClick: function(e) {
		var globalHalf = this._betValueBtn.localToGlobal(this._betValueBtn.image.width / 2,0);
		if(e.stageX > globalHalf.x) this.increaseBetValue(); else this.decreaseBetValue();
	}
	,constructLevel: function() {
		var countryName = co.doubleduck.DataLoader.getCountryById(this._slotID).name;
		this._background = co.doubleduck.Assets.getImage("images/slots/" + countryName + "/background.png");
		this._background.regX = this._background.image.width / 2;
		this._background.regY = this._background.image.height / 2;
		this.addChild(this._background);
		this._background.scaleX = this._background.scaleY = co.doubleduck.Game.getScale();
		this._background.x = co.doubleduck.Game.getViewport().width / 2;
		this._background.y = co.doubleduck.Game.getViewport().height / 2;
		this._machine = new co.doubleduck.SlotMachine(this._slotID);
		this._machine.x = co.doubleduck.Game.getViewport().width / 2;
		this._machine.y = co.doubleduck.Game.getViewport().height * 0.47;
		this.addChild(this._machine);
		this._machine.initMachine();
		this._machine.onResult = $bind(this,this.handleRollResult);
		var topBorder = co.doubleduck.Assets.getImage("images/slots/" + countryName + "/border_top.png");
		topBorder.regY = topBorder.image.height / 2;
		topBorder.regX = topBorder.image.width / 2;
		topBorder.scaleX = topBorder.scaleY = co.doubleduck.Game.getScale();
		topBorder.x = this._machine.x;
		topBorder.y = this._machine.y - this._machine.getHeight() / 2 * co.doubleduck.Game.getScale();
		this.addChild(topBorder);
		var bottomBorder = co.doubleduck.Assets.getImage("images/slots/" + countryName + "/border_bottom.png");
		bottomBorder.regY = bottomBorder.image.height / 2;
		bottomBorder.regX = bottomBorder.image.width / 2;
		bottomBorder.scaleX = bottomBorder.scaleY = co.doubleduck.Game.getScale();
		bottomBorder.x = this._machine.x;
		bottomBorder.y = this._machine.y + this._machine.getHeight() / 2 * co.doubleduck.Game.getScale();
		this.addChild(bottomBorder);
		this._buttonContainer = new createjs.Container();
		this.addChild(this._buttonContainer);
		this._spinButton = new co.doubleduck.SpinButton();
		this._spinButton.scaleX = this._spinButton.scaleY = co.doubleduck.Game.getScale();
		this._spinButton.x = co.doubleduck.Game.getViewport().width;
		this._spinButton.y = this._machine.y + (this._machine.getHeight() / 2 + 32) * co.doubleduck.Game.getScale();
		this._spinButton.onClick = $bind(this,this.handleRollClick);
		this._spinButton.idle();
		this._buttonContainer.addChild(this._spinButton);
		this._maxLinesBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/ui/maxlines_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._maxLinesBtn.regX = this._maxLinesBtn.image.width;
		this._maxLinesBtn.regY = 0;
		this._maxLinesBtn.x = this._spinButton.x - (this._spinButton.spriteSheet._frameWidth + 5) * co.doubleduck.Game.getScale();
		this._maxLinesBtn.y = this._spinButton.y + this._spinButton.spriteSheet._frameHeight * 0.05 * co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._maxLinesBtn);
		this._maxLinesBtn.scaleX = this._maxLinesBtn.scaleY = co.doubleduck.Game.getScale();
		this._maxLinesBtn.onClick = $bind(this,this.handleMaxLines);
		this._lineAmountBox = co.doubleduck.Assets.getImage("images/ui/lines.png");
		this._lineAmountBox.regX = this._lineAmountBox.image.width;
		this._lineAmountBox.regY = 0;
		this._lineAmountBox.y = this._maxLinesBtn.y + (this._maxLinesBtn.image.height + 5) * co.doubleduck.Game.getScale();
		this._lineAmountBox.x = this._maxLinesBtn.x;
		this._lineAmountBox.scaleX = this._lineAmountBox.scaleY = co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._lineAmountBox);
		this._lineAmountBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/ui/plusminus_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._lineAmountBtn.regX = this._lineAmountBtn.image.width;
		this._lineAmountBtn.regY = 0;
		this._lineAmountBtn.scaleX = this._lineAmountBtn.scaleY = co.doubleduck.Game.getScale();
		this._lineAmountBtn.onClick = $bind(this,this.handleLineAmountClick);
		this._lineAmountBtn.x = this._lineAmountBox.x;
		this._lineAmountBtn.y = this._lineAmountBox.y + this._lineAmountBox.image.height * 0.6 * co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._lineAmountBtn);
		var px = 22 * co.doubleduck.Game.getScale();
		this._lineAmountDisplay = new createjs.Text("" + this._numLines,"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
		this._lineAmountDisplay.textAlign = "right";
		this._lineAmountDisplay.regY = this._lineAmountDisplay.getMeasuredHeight() / 2;
		this._lineAmountDisplay.y = this._lineAmountBox.y + this._lineAmountBox.image.height * 0.355 * co.doubleduck.Game.getScale();
		this._lineAmountDisplay.x = this._lineAmountBox.x - 10 * co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._lineAmountDisplay);
		this._totalBets = co.doubleduck.Assets.getImage("images/ui/totalbet.png");
		this._totalBets.regX = this._totalBets.image.width;
		this._totalBets.regY = this._totalBets.image.height / 2;
		this._totalBets.x = this._maxLinesBtn.x - (this._maxLinesBtn.image.width + 7) * co.doubleduck.Game.getScale();
		this._totalBets.y = this._maxLinesBtn.y + this._totalBets.image.height / 2 * co.doubleduck.Game.getScale();
		this._totalBets.scaleX = this._totalBets.scaleY = co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._totalBets);
		this._totalBetDisplay = new createjs.Text("" + 0,"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
		this._totalBetDisplay.textAlign = "right";
		this._totalBetDisplay.regY = this._totalBetDisplay.getMeasuredHeight() / 2;
		this._totalBetDisplay.regX = 0;
		this._totalBetDisplay.y = this._totalBets.y;
		this._totalBetDisplay.x = this._totalBets.x - 10 * co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._totalBetDisplay);
		var xpPx = 25 * co.doubleduck.Game.getScale();
		this._gotXpText = new createjs.Text("+1 XP","" + xpPx + "px Helvetica, Arial, sans-serif","#005500");
		this._gotXpText.textAlign = "center";
		this._betBox = co.doubleduck.Assets.getImage("images/ui/bet.png");
		this._betBox.regX = this._betBox.image.width;
		this._betBox.regY = 0;
		this._betBox.x = this._lineAmountBox.x - (this._lineAmountBox.image.width + 7) * co.doubleduck.Game.getScale();
		this._betBox.y = this._lineAmountBox.y;
		this._betBox.scaleX = this._betBox.scaleY = co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._betBox);
		this._betValueBtn = new co.doubleduck.Button(co.doubleduck.Assets.getImage("images/ui/plusminus_btn.png"),true,co.doubleduck.Button.CLICK_TYPE_SCALE);
		this._betValueBtn.regX = this._betValueBtn.image.width;
		this._betValueBtn.regY = 0;
		this._betValueBtn.scaleX = this._betValueBtn.scaleY = co.doubleduck.Game.getScale();
		this._betValueBtn.onClick = $bind(this,this.handleBetValueClick);
		this._betValueBtn.y = this._betBox.y + this._betBox.image.height * 0.6 * co.doubleduck.Game.getScale();
		this._betValueBtn.x = this._betBox.x;
		this._buttonContainer.addChild(this._betValueBtn);
		this._betValueDisplay = new createjs.Text("" + this._betAmount,"" + px + "px Helvetica, Arial, sans-serif","#ffd500");
		this._betValueDisplay.textAlign = "right";
		this._betValueDisplay.regY = this._betValueDisplay.getMeasuredHeight() / 2;
		this._betValueDisplay.regX = 0;
		this._betValueDisplay.y = this._lineAmountDisplay.y;
		this._betValueDisplay.x = this._betBox.x - 10 * co.doubleduck.Game.getScale();
		this._buttonContainer.addChild(this._betValueDisplay);
		this.updateTotalBet();
		this._slotLines = new co.doubleduck.SlotLines(this._slotID);
		this.addChild(this._slotLines);
		this._slotLines.scaleX = this._slotLines.scaleY = co.doubleduck.Game.getScale();
		this._slotLines.x = this._machine.x;
		this._slotLines.y = this._machine.y;
		var totalWidth = 0;
		totalWidth += this._betValueBtn.image.width * co.doubleduck.Game.getScale() + 7 * co.doubleduck.Game.getScale();
		totalWidth += this._lineAmountBtn.image.width * co.doubleduck.Game.getScale() + 5 * co.doubleduck.Game.getScale();
		totalWidth += this._spinButton.spriteSheet._frameWidth * co.doubleduck.Game.getScale();
		this._buttonContainer.x -= co.doubleduck.Game.getViewport().width - totalWidth - co.doubleduck.Game.getViewport().width / 2;
		this._buttonContainer.regX = totalWidth / 2;
	}
	,handleHelpOpened: function() {
		this.mouseEnabled = false;
	}
	,handleHelpClosed: function() {
		this.mouseEnabled = true;
	}
	,__class__: co.doubleduck.Session
});
co.doubleduck.SlotIcon = function(slotID,iconID) {
	createjs.BitmapAnimation.call(this,co.doubleduck.SlotIcon.getIconSheet(slotID));
	this._iconId = iconID;
	this.gotoAndStop(co.doubleduck.SlotIcon.PREFIX + iconID);
};
co.doubleduck.SlotIcon.__name__ = true;
co.doubleduck.SlotIcon.getIconSheet = function(slotID) {
	if(co.doubleduck.SlotIcon._iconSheets == null) {
		co.doubleduck.SlotIcon._iconSheets = new Array();
		var _g1 = 0, _g = co.doubleduck.DataLoader.getAllCountries().length;
		while(_g1 < _g) {
			var i = _g1++;
			var slotName = co.doubleduck.DataLoader.getSlotIconById(i + 1).name;
			var img = co.doubleduck.Assets.getRawImage("images/slots/" + slotName + "/icons.png");
			var initObject = { };
			initObject.images = [img];
			initObject.frames = { width : co.doubleduck.SlotIcon.ICON_SIZE, height : co.doubleduck.SlotIcon.ICON_SIZE, regX : co.doubleduck.SlotIcon.ICON_SIZE / 2, regY : co.doubleduck.SlotIcon.ICON_SIZE / 2};
			initObject.animations = { };
			var _g3 = 0, _g2 = co.doubleduck.SlotIcon.ICONS_COUNT;
			while(_g3 < _g2) {
				var j = _g3++;
				initObject.animations[co.doubleduck.SlotIcon.PREFIX + (j + 1)] = { frames : j, frequency : 20};
			}
			co.doubleduck.SlotIcon._iconSheets[i] = new createjs.SpriteSheet(initObject);
		}
	}
	return co.doubleduck.SlotIcon._iconSheets[slotID - 1];
}
co.doubleduck.SlotIcon.__super__ = createjs.BitmapAnimation;
co.doubleduck.SlotIcon.prototype = $extend(createjs.BitmapAnimation.prototype,{
	getId: function() {
		return this._iconId;
	}
	,__class__: co.doubleduck.SlotIcon
});
co.doubleduck.SlotLines = function(slotId) {
	this._displayingWinningLines = false;
	createjs.Container.call(this);
	this._slotId = slotId;
	this._allLines = new Array();
	this._lineData = new Array();
	var slotLineIds = co.doubleduck.DataLoader.getSlotMachineById(this._slotId).lines;
	var _g1 = 0, _g = slotLineIds.length;
	while(_g1 < _g) {
		var currLineId = _g1++;
		this._lineData.push(co.doubleduck.DataLoader.getSlotLineById(slotLineIds[currLineId] | 0));
	}
	this.initLines();
	this.regX = co.doubleduck.SlotIcon.ICON_SIZE * 5 / 2 - co.doubleduck.SlotIcon.ICON_SIZE * 1.5;
	this.regY = 0;
};
co.doubleduck.SlotLines.__name__ = true;
co.doubleduck.SlotLines.__super__ = createjs.Container;
co.doubleduck.SlotLines.prototype = $extend(createjs.Container.prototype,{
	getLineById: function(id) {
		var _g1 = 0, _g = this._lineData.length;
		while(_g1 < _g) {
			var currLine = _g1++;
			if((this._lineData[currLine].id | 0) == id) return this._allLines[currLine];
		}
		return null;
	}
	,lineFlicker: function() {
		if(this._rects != null) {
			this.removeChild(this._rects);
			this._rects = null;
		}
		this._rects = new createjs.Container();
		if(!this._displayingWinningLines) return;
		var lineToFlicker = this.getLineById(this._flickeringLines[this._currFlickeringLineIndex]);
		var winningSlots = this._winningSlotIcons[this._currFlickeringLineIndex];
		var lineId = this._flickeringLines[this._currFlickeringLineIndex];
		this._currFlickeringLineIndex += 1;
		if(this._currFlickeringLineIndex >= this._flickeringLines.length) this._currFlickeringLineIndex = 0;
		lineToFlicker.visible = true;
		lineToFlicker.alpha = 0;
		createjs.Tween.get(lineToFlicker).to({ alpha : 1},250,createjs.Ease.sineOut).wait(60).to({ alpha : 0},250,createjs.Ease.sineIn).wait(100).to({ alpha : 1},250,createjs.Ease.sineOut).wait(30).to({ alpha : 0},250,createjs.Ease.sineIn).wait(500).call($bind(this,this.lineFlicker));
		var _g1 = 0, _g = winningSlots.length;
		while(_g1 < _g) {
			var currSlot = _g1++;
			var slot = winningSlots[currSlot];
			var rect = co.doubleduck.Assets.getImage("images/ui/rect/" + lineId + ".png");
			rect.regX = rect.image.width / 2;
			rect.regY = rect.image.height / 2;
			rect.x = slot.x - co.doubleduck.SlotIcon.ICON_SIZE * 1.5;
			rect.y = slot.y - co.doubleduck.SlotIcon.ICON_SIZE * 1.5;
			this._rects.addChild(rect);
		}
		this.addChild(this._rects);
	}
	,hideLines: function() {
		if(this._rects != null) this.removeChild(this._rects);
		this._displayingWinningLines = false;
		var _g1 = 0, _g = this._allLines.length;
		while(_g1 < _g) {
			var currLine = _g1++;
			this._allLines[currLine].visible = false;
		}
	}
	,displayWinningLines: function(winningLineIds,winningSlotIcons) {
		this._displayingWinningLines = true;
		this._currFlickeringLineIndex = 0;
		this._winningSlotIcons = winningSlotIcons;
		this._flickeringLines = winningLineIds;
		this.lineFlicker();
	}
	,enableLines: function(linesId) {
		if(this._rects != null) this.removeChild(this._rects);
		this._displayingWinningLines = false;
		var _g1 = 0, _g = this._lineData.length;
		while(_g1 < _g) {
			var currLineNum = _g1++;
			var found = false;
			var _g3 = 0, _g2 = linesId.length;
			while(_g3 < _g2) {
				var currRequestedLineId = _g3++;
				if((this._lineData[currLineNum].id | 0) == linesId[currRequestedLineId]) {
					found = true;
					break;
				}
			}
			createjs.Tween.removeTweens(this._allLines[currLineNum]);
			this._allLines[currLineNum].visible = found;
			this._allLines[currLineNum].alpha = 1;
		}
	}
	,pointsConvert: function(points) {
		var result = new Array();
		var _g1 = 0, _g = points.length;
		while(_g1 < _g) {
			var currPointNum = _g1++;
			var nz = points[currPointNum];
			var currPoint = new createjs.Point(((nz.col | 0) - 1) * co.doubleduck.SlotIcon.ICON_SIZE,((nz.row | 0) - 1) * co.doubleduck.SlotIcon.ICON_SIZE);
			result[result.length] = currPoint;
		}
		return result;
	}
	,initLines: function() {
		this._allLinesContainer = new createjs.Container();
		var _g1 = 0, _g = this._lineData.length;
		while(_g1 < _g) {
			var currLineId = _g1++;
			var currLine = this._lineData[currLineId];
			var lineGfx = co.doubleduck.Utils.createBitmapLineOverlay(this.pointsConvert(currLine.points),"images/ui/ling/" + (this._lineData[currLineId].id | 0) + ".png");
			this._allLinesContainer.addChild(lineGfx);
			lineGfx.visible = false;
			this._allLines[this._allLines.length] = lineGfx;
		}
		this.addChild(this._allLinesContainer);
	}
	,__class__: co.doubleduck.SlotLines
});
co.doubleduck.SlotMachine = function(slotID) {
	this._wheelToMove = 0;
	createjs.Container.call(this);
	this._slotID = slotID;
	this._iconsPool = new Array();
	var _g1 = 0, _g = co.doubleduck.SlotIcon.ICONS_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		this._iconsPool[i] = new Array();
	}
	this._iconsData = co.doubleduck.DataLoader.getSlotMachineById(slotID).icons;
	this._rollTotal = 0;
	var _g1 = 0, _g = co.doubleduck.SlotIcon.ICONS_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		this._rollTotal += this._iconsData[i].probability;
	}
	this._wheelsLayer = new createjs.Container();
	this._wheelIcons = new Array();
	this._wheelSpeeds = new Array();
	this._accelRates = new Array();
	var _g1 = 0, _g = co.doubleduck.SlotMachine.WHEEL_COUNT;
	while(_g1 < _g) {
		var wheel = _g1++;
		this._wheelIcons[wheel] = new Array();
		var _g3 = 0, _g2 = co.doubleduck.SlotMachine.WHEEL_LENGTH;
		while(_g3 < _g2) {
			var i = _g3++;
			this.addSlotIcon(wheel,true);
		}
		this._wheelSpeeds[wheel] = 0;
		this._accelRates[wheel] = 0;
	}
	this.addChild(this._wheelsLayer);
	this.scaleX = this.scaleY = co.doubleduck.Game.getScale();
	this.regX = this.getWidth() / 2;
	this.regY = this.getHeight() / 2;
};
co.doubleduck.SlotMachine.__name__ = true;
co.doubleduck.SlotMachine.getFirstNonJokerIndex = function(icons,startAt) {
	if(startAt == null) startAt = 0;
	var _g1 = startAt, _g = icons.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(icons[i].getId() != co.doubleduck.SlotMachine.JOKER_ID) return i;
	}
	return -1;
}
co.doubleduck.SlotMachine.__super__ = createjs.Container;
co.doubleduck.SlotMachine.prototype = $extend(createjs.Container.prototype,{
	getHeight: function() {
		return co.doubleduck.SlotMachine.WHEEL_LENGTH * co.doubleduck.SlotIcon.ICON_SIZE;
	}
	,getWidth: function() {
		return co.doubleduck.SlotMachine.WHEEL_COUNT * co.doubleduck.SlotIcon.ICON_SIZE;
	}
	,checkRollResult: function() {
		return null;
	}
	,getIconData: function(id) {
		var _g1 = 0, _g = this._iconsData.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._iconsData[i].id == id) return this._iconsData[i];
		}
		return null;
	}
	,rollIcon: function() {
		var rolled = Std.random(this._rollTotal);
		var _g1 = 0, _g = co.doubleduck.SlotIcon.ICONS_COUNT;
		while(_g1 < _g) {
			var i = _g1++;
			rolled -= this._iconsData[i].probability;
			if(rolled < 0) return i + 1;
		}
		return 0;
	}
	,returnSlotIcon: function(icon) {
		this._iconsPool[icon.getId() - 1].push(icon);
	}
	,getSlotIcon: function(type) {
		if(this._iconsPool[type - 1].length > 0) return this._iconsPool[type - 1].pop();
		return new co.doubleduck.SlotIcon(this._slotID,type);
	}
	,addSlotIcon: function(wheel,fake,icon) {
		if(icon == null) icon = this.randSlotIcon(fake);
		icon.x = (wheel + 0.5) * co.doubleduck.SlotIcon.ICON_SIZE;
		if(this._wheelIcons[wheel].length > 0) icon.y = this._wheelIcons[wheel][0].y - co.doubleduck.SlotIcon.ICON_SIZE; else icon.y = (co.doubleduck.SlotMachine.WHEEL_LENGTH - 0.5) * co.doubleduck.SlotIcon.ICON_SIZE;
		this._wheelIcons[wheel].unshift(icon);
		this._wheelsLayer.addChild(icon);
		return icon;
	}
	,randSlotIcon: function(fake) {
		var icon;
		if(fake) icon = this.getSlotIcon(Std.random(co.doubleduck.SlotIcon.ICONS_COUNT) + 1); else icon = this.getSlotIcon(this.rollIcon());
		return icon;
	}
	,handleRollEnd: function() {
		this.onTick = null;
		if(this.onResult != null) {
			var results = new Array();
			var lineIdArray = new Array();
			this.removeChild(this._wheelsLayer);
			this.addChild(this._wheelsLayer);
			var _g1 = 0, _g = this._rolledLines.length;
			while(_g1 < _g) {
				var lineInd = _g1++;
				var line = co.doubleduck.DataLoader.getSlotLineById(this._rolledLines[lineInd]);
				var iconsOnLine = new Array();
				var _g3 = 0, _g2 = line.points.length;
				while(_g3 < _g2) {
					var point = _g3++;
					iconsOnLine.push(this._wheelIcons[line.points[point].col][line.points[point].row]);
				}
				var typeIndex = co.doubleduck.SlotMachine.getFirstNonJokerIndex(iconsOnLine);
				if(typeIndex == -1) break;
				var typeId = iconsOnLine[typeIndex].getId();
				var sequence = new Array();
				sequence.push(iconsOnLine[0]);
				var sequenceFound = false;
				var _g3 = 1, _g2 = iconsOnLine.length;
				while(_g3 < _g2) {
					var j = _g3++;
					if(iconsOnLine[j].getId() == typeId || iconsOnLine[j].getId() == co.doubleduck.SlotMachine.JOKER_ID) {
						sequence.push(iconsOnLine[j]);
						if(sequence.length >= this.getIconData(typeId).minForSequence) sequenceFound = true;
					} else break;
				}
				if(sequenceFound) {
					results.push(sequence);
					lineIdArray.push(this._rolledLines[lineInd]);
				}
			}
			this.onResult(results,lineIdArray);
		}
	}
	,stopEase: function(t) {
		if(t <= 0) return 0; else if(t >= 1) return 1;
		return -1.4 * t * t + 2.4 * t;
	}
	,playStopSound: function() {
		co.doubleduck.SoundManager.playEffect("sound/wheel_stop.ogg");
	}
	,handleTick: function(elapsed) {
		var wheelsMove = false;
		var _g1 = 0, _g = co.doubleduck.SlotMachine.WHEEL_COUNT;
		while(_g1 < _g) {
			var wheel = _g1++;
			if(!this._startedMoveForward || this._wheelSpeeds[wheel] != 0) {
				wheelsMove = true;
				if(!this._startedMoveForward && this._wheelSpeeds[co.doubleduck.SlotMachine.WHEEL_COUNT - 1] > 0) this._startedMoveForward = true;
				this._wheelSpeeds[wheel] += this._accelRates[wheel] * elapsed;
				var _g3 = 0, _g2 = this._wheelIcons[wheel].length;
				while(_g3 < _g2) {
					var j = _g3++;
					this._wheelIcons[wheel][j].y += this._wheelSpeeds[wheel];
				}
				if(this._wheelIcons[wheel][this._wheelIcons[wheel].length - 1].y - co.doubleduck.SlotIcon.ICON_SIZE * 0.5 > this.getHeight()) {
					var icon = this._wheelIcons[wheel].pop();
					this._wheelsLayer.removeChild(icon);
					this.returnSlotIcon(icon);
				}
				while(this._wheelIcons[wheel].length == 0 || this._wheelIcons[wheel][0].y >= 0) this.addSlotIcon(wheel,true);
			} else if(this._startedDeccel) {
				var _g3 = 1, _g2 = this._wheelIcons[wheel].length;
				while(_g3 < _g2) {
					var i = _g3++;
					this._wheelIcons[wheel][i].y = this._wheelIcons[wheel][i - 1].y + co.doubleduck.SlotIcon.ICON_SIZE;
				}
				if(this._wheelIcons[wheel][this._wheelIcons[wheel].length - 1].y - co.doubleduck.SlotIcon.ICON_SIZE * 0.5 > this.getHeight()) {
					var icon = this._wheelIcons[wheel].pop();
					this._wheelsLayer.removeChild(icon);
					this.returnSlotIcon(icon);
				}
			}
		}
		if(wheelsMove) {
			if(this._wheelSpeeds[co.doubleduck.SlotMachine.WHEEL_COUNT - 1] >= co.doubleduck.SlotMachine.MAX_TURN_SPEED && !this._startedDeccel) {
				this._startedDeccel = true;
				this._rateToSet = co.doubleduck.SlotMachine.DECCEL_RATE;
				this._wheelToMove = 0;
				this.setAccelRate();
			}
			if(this._startedDeccel) {
				var _g1 = 0, _g = co.doubleduck.SlotMachine.WHEEL_COUNT;
				while(_g1 < _g) {
					var wheel = _g1++;
					if(this._wheelSpeeds[wheel] != 0 && this._wheelSpeeds[wheel] < co.doubleduck.SlotMachine.STOP_THRESH) {
						this._accelRates[wheel] = 0;
						this._wheelSpeeds[wheel] = 0;
						this._rollResult[wheel] = new Array();
						var _g3 = 0, _g2 = co.doubleduck.SlotMachine.WHEEL_LENGTH;
						while(_g3 < _g2) {
							var i = _g3++;
							var isSame = true;
							var newIcon = null;
							while(isSame) {
								newIcon = this.randSlotIcon(false);
								if(i != 0) isSame = this._rollResult[wheel][0].getId() == newIcon.getId(); else isSame = false;
							}
							this.addSlotIcon(wheel,false,newIcon);
							this._rollResult[wheel].unshift(newIcon);
						}
						var newIcon = this._rollResult[wheel][0];
						var tween = createjs.Tween.get(newIcon);
						var amp = 0.4;
						if(wheel == co.doubleduck.SlotMachine.WHEEL_COUNT - 1) tween.to({ y : 0.5 * co.doubleduck.SlotIcon.ICON_SIZE},1500,$bind(this,this.stopEase)).call($bind(this,this.playStopSound)).call($bind(this,this.handleRollEnd)); else tween.to({ y : 0.5 * co.doubleduck.SlotIcon.ICON_SIZE},1500,$bind(this,this.stopEase)).call($bind(this,this.playStopSound));
					}
				}
			}
		}
	}
	,setAccelRate: function() {
		if(this._wheelToMove < co.doubleduck.SlotMachine.WHEEL_COUNT) {
			if(!this._startedDeccel) this._wheelSpeeds[this._wheelToMove] = co.doubleduck.SlotMachine.INIT_SPEED;
			this._accelRates[this._wheelToMove] = this._rateToSet;
			this._wheelToMove++;
			var delay;
			if(this._startedDeccel) delay = co.doubleduck.SlotMachine.DECCEL_DELAY; else delay = co.doubleduck.SlotMachine.ACCEL_DELAY;
			co.doubleduck.Utils.waitAndCall(this,delay + Std.random(100),$bind(this,this.setAccelRate));
		}
	}
	,startRoll: function(lines) {
		this._rolledLines = lines;
		this._wheelToMove = 0;
		this._rateToSet = co.doubleduck.SlotMachine.ACCEL_RATE;
		this._startedDeccel = false;
		this._startedMoveForward = false;
		this._rollResult = new Array();
		this.setAccelRate();
		this.onTick = $bind(this,this.handleTick);
	}
	,initMachine: function() {
		this._wheelsMask = new createjs.Shape();
		this._wheelsMask.graphics.beginFill("#000000");
		this._wheelsMask.graphics.drawRect(0,0,this.getWidth(),this.getHeight());
		this._wheelsMask.graphics.endFill();
		this._wheelsMask.regX = this.regX;
		this._wheelsMask.regY = this.regY;
		this._wheelsMask.x = this.x;
		this._wheelsMask.y = this.y;
		this._wheelsMask.scaleX = this.scaleX;
		this._wheelsMask.scaleY = this.scaleY;
		this.mask = this._wheelsMask;
	}
	,__class__: co.doubleduck.SlotMachine
});
co.doubleduck.SoundManager = function() {
};
co.doubleduck.SoundManager.__name__ = true;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.Persistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.Persistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Android/.test(navigator.userAgent);
	var isAndroid = /Mobile/.test(navigator.userAgent);
	if(isFirefox) return true;
	if(isChrome && (!isAndroid && !isMobile)) return true;
	return false;
}
co.doubleduck.SoundManager.mute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
}
co.doubleduck.SoundManager.unmute = function() {
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(1);
	}
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
	co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.isMuted = function() {
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		audio = new co.doubleduck.audio.AudioFX(src);
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume) {
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.SpinButton = function() {
	var img = co.doubleduck.Assets.getRawImage("images/ui/spin_btn.png");
	var initObject = { };
	initObject.images = [img];
	initObject.frames = { width : co.doubleduck.SpinButton.FRAME_WIDTH, height : co.doubleduck.SpinButton.FRAME_HEIGHT, regX : co.doubleduck.SpinButton.FRAME_WIDTH};
	initObject.animations = { };
	initObject.animations.idle = { frames : [0], frequency : 1, next : false};
	initObject.animations.clicked = { frames : [1], frequency : 1, next : false};
	initObject.animations.active = { frames : [2,3,4], frequency : 7, next : "active"};
	var spritesheet = new createjs.SpriteSheet(initObject);
	createjs.BitmapAnimation.call(this,spritesheet);
	this.mouseEnabled = true;
	this.gotoAndStop("idle");
};
co.doubleduck.SpinButton.__name__ = true;
co.doubleduck.SpinButton.__super__ = createjs.BitmapAnimation;
co.doubleduck.SpinButton.prototype = $extend(createjs.BitmapAnimation.prototype,{
	active: function() {
		this.gotoAndPlay("active");
	}
	,clicked: function() {
		this.gotoAndStop("clicked");
		co.doubleduck.Utils.waitAndCall(this,200,$bind(this,this.active));
	}
	,idle: function() {
		this.gotoAndStop("idle");
	}
	,__class__: co.doubleduck.SpinButton
});
co.doubleduck.Utils = function() {
};
co.doubleduck.Utils.__name__ = true;
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.createBitmapLineOverlay = function(points,texture) {
	var img = co.doubleduck.Assets.getRawImage(texture);
	var result = new createjs.Container();
	var _g1 = 0, _g = points.length;
	while(_g1 < _g) {
		var currPoint = _g1++;
		var line = new createjs.Shape();
		var prevPoint = new createjs.Point(0,0);
		if(currPoint != 0) {
			prevPoint.x = points[currPoint - 1].x;
			prevPoint.y = points[currPoint - 1].y;
		} else continue;
		line.graphics.moveTo(0,img.height / 2);
		line.graphics.setStrokeStyle(img.height,1);
		line.graphics.beginBitmapStroke(img,"repeat-x");
		var dx = points[currPoint].x - prevPoint.x;
		var dy = points[currPoint].y - prevPoint.y;
		var length = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		line.regX = length / 2;
		line.regY = img.height / 2;
		line.graphics.lineTo(length,img.height / 2);
		line.graphics.endStroke();
		line.x = (points[currPoint].x + prevPoint.x) / 2;
		line.y = (points[currPoint].y + prevPoint.y) / 2;
		line.rotation = Math.atan2(dy,dx) * 180 / Math.PI;
		result.addChild(line);
	}
	return result;
}
co.doubleduck.Utils.getRectStrokeOverlay = function(width,height) {
	var shp = new createjs.Shape();
	shp.graphics.beginStroke("#ffd500");
	shp.graphics.setStrokeStyle(5,1);
	shp.graphics.drawRect(0,0,width,height);
	shp.regX = width / 2;
	shp.regY = height / 2;
	return shp;
}
co.doubleduck.Utils.numString = function(num) {
	var numStr = "" + num;
	var r = new EReg("\\d{1,3}(?=(\\d{3})+(?!\\d))","g");
	return r.replace(numStr,"$&,");
}
co.doubleduck.Utils.prototype = {
	__class__: co.doubleduck.Utils
}
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = function() { }
co.doubleduck.audio.AudioAPI.__name__ = true;
co.doubleduck.audio.AudioAPI.prototype = {
	__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.AudioFX = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = true;
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src.split(".")[0];
		this._jsAudio = AudioFX(pathNoExtension, { formats: ['ogg'], loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = true;
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HTML5Audio = function(src) {
	this._src = src;
	this.load();
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HTML5Audio.__name__ = true;
co.doubleduck.audio.HTML5Audio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HTML5Audio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
	}
	,pause: function() {
		this._jsAudio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this.pause();
		this._jsAudio.currentTime = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		this._jsAudio.volume = volume;
		this._jsAudio.initialTime = 0;
		this._jsAudio.play();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(overrideOtherEffects && co.doubleduck.audio.HTML5Audio._currentlyPlaying != null) {
			co.doubleduck.audio.HTML5Audio._currentlyPlaying.pause();
			co.doubleduck.audio.HTML5Audio._currentlyPlaying.currentTime = 0;
		}
		this._jsAudio = new Audio();
		this._jsAudio.src = this._src;
		this._jsAudio.volume = volume;
		this._jsAudio.play();
		co.doubleduck.audio.HTML5Audio._currentlyPlaying = this._jsAudio;
	}
	,load: function() {
		this._jsAudio = new Audio();
		this._jsAudio.src = this._src;
		this._jsAudio.initialTime = 0;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.HTML5Audio
}
var haxe = haxe || {}
haxe.Int32 = function() { }
haxe.Int32.__name__ = true;
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
if(!haxe.io) haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return Std.parseInt((((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * Math.pow(2,32)).toString()) + Std.parseInt(((bytes[4] >> 7) * Math.pow(2,31)).toString()) + Std.parseInt(((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]).toString());
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?(ch1 << 8 | ch2) << 16 | (ch3 << 8 | ch4):(ch4 << 8 | ch3) << 16 | (ch2 << 8 | ch1);
	}
	,readUInt30: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if((this.bigEndian?ch1:ch4) >= 64) throw haxe.io.Error.Overflow;
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readInt31: function() {
		var ch1, ch2, ch3, ch4;
		if(this.bigEndian) {
			ch4 = this.readByte();
			ch3 = this.readByte();
			ch2 = this.readByte();
			ch1 = this.readByte();
		} else {
			ch1 = this.readByte();
			ch2 = this.readByte();
			ch3 = this.readByte();
			ch4 = this.readByte();
		}
		if((ch4 & 128) == 0 != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
if(!haxe.macro) haxe.macro = {}
haxe.macro.Constant = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp","CType"] }
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Constant.CType = function(s) { var $x = ["CType",5,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; }
haxe.macro.Binop = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval"] }
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; }
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] }
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = { __ename__ : true, __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EType"] }
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ExprDef.EType = function(e,field) { var $x = ["EType",29,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; }
haxe.macro.ComplexType = { __ename__ : true, __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] }
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; }
haxe.macro.TypeParam = { __ename__ : true, __constructs__ : ["TPType","TPExpr"] }
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; }
haxe.macro.Access = { __ename__ : true, __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline"] }
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = { __ename__ : true, __constructs__ : ["FVar","FFun","FProp"] }
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; }
haxe.macro.TypeDefKind = { __ename__ : true, __constructs__ : ["TDEnum","TDStructure","TDClass"] }
haxe.macro.TypeDefKind.TDEnum = ["TDEnum",0];
haxe.macro.TypeDefKind.TDEnum.toString = $estr;
haxe.macro.TypeDefKind.TDEnum.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDStructure = ["TDStructure",1];
haxe.macro.TypeDefKind.TDStructure.toString = $estr;
haxe.macro.TypeDefKind.TDStructure.__enum__ = haxe.macro.TypeDefKind;
haxe.macro.TypeDefKind.TDClass = function(extend,implement,isInterface) { var $x = ["TDClass",2,extend,implement,isInterface]; $x.__enum__ = haxe.macro.TypeDefKind; $x.toString = $estr; return $x; }
haxe.macro.Error = function(m,p) {
	this.message = m;
	this.pos = p;
};
haxe.macro.Error.__name__ = true;
haxe.macro.Error.prototype = {
	__class__: haxe.macro.Error
}
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
js.Lib.__name__ = true;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.Assets._cacheData = { };
co.doubleduck.Assets._loadCallbacks = { };
co.doubleduck.Assets.loaded = 0;
co.doubleduck.Assets._useLocalStorage = false;
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Dropper.PREFIX = "droplet";
co.doubleduck.Dropper.DROPLET_SIZE = 120;
co.doubleduck.Dropper.DROPLET_COUNT = 6;
co.doubleduck.Dropper.DROP_TIME = 1600;
co.doubleduck.Game._scale = 1;
co.doubleduck.Game.MAX_HEIGHT = 641;
co.doubleduck.Game.MAX_WIDTH = 427;
co.doubleduck.Game.HD = false;
co.doubleduck.Game.DEBUG = false;
co.doubleduck.Persistence.GAME_PREFIX = "SLO";
co.doubleduck.Persistence.available = co.doubleduck.Persistence.localStorageSupported();
co.doubleduck.Session.MAX_DROP_THRESH = 0.25;
co.doubleduck.SlotIcon.ICONS_COUNT = 10;
co.doubleduck.SlotIcon.ICON_SIZE = 75;
co.doubleduck.SlotIcon.PREFIX = "icon";
co.doubleduck.SlotMachine.WHEEL_COUNT = 5;
co.doubleduck.SlotMachine.WHEEL_LENGTH = 3;
co.doubleduck.SlotMachine.JOKER_ID = 1;
co.doubleduck.SlotMachine.INIT_SPEED = -7;
co.doubleduck.SlotMachine.MAX_TURN_SPEED = 17;
co.doubleduck.SlotMachine.ACCEL_RATE = 0.04;
co.doubleduck.SlotMachine.DECCEL_RATE = -0.05;
co.doubleduck.SlotMachine.STOP_THRESH = 8;
co.doubleduck.SlotMachine.ACCEL_DELAY = 80;
co.doubleduck.SlotMachine.DECCEL_DELAY = 400;
co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.SpinButton.FRAME_WIDTH = 130;
co.doubleduck.SpinButton.FRAME_HEIGHT = 121;
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HTML5Audio._muted = false;
co.doubleduck.Main.main();
