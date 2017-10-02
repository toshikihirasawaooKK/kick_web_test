if(!('console' in window)){window.console = {};window.console.log = function(str){return str};}
(function (w, r) {
    w['r'+r] = w['r'+r] || w['webkitR'+r] || w['mozR'+r] || w['msR'+r] || w['oR'+r] || function(c){ Util.REQUESTANIMATIONFRAME_TIMEOUTID = w.setTimeout(c, 1000 / 60); };
})(window, 'equestAnimationFrame');

(function (w, r) {
    w[r] = w[r] || w['webkit'+r] || w['moz'+r] || w['ms'+r] || function(){ w.clearTimeout(Util.REQUESTANIMATIONFRAME_TIMEOUTID); };
})(window, 'cancelAnimationFrame');

var Util = {
    BREAK_POINT: 750,
    FPS:60,
    BASE_EASING:"easeOutQuint",
    BASE_TIME:800,
    BASE_YPOS:30,
    windowSize:{w:0,h:0},
    isYoutubeApiReady:false,
    isGoogleMapApiReady:false,
    isSp: false,
    isTouch:('ontouchstart' in window),
    isBreakpoint: null,
    isSafari:(navigator.userAgent.indexOf('Safari') != -1),
    isiOS:navigator.userAgent.match(/(iPhone|iPod)/),
    isAndroid:navigator.userAgent.match(/Android/),
    isAndroidChrome:(navigator.userAgent.match(/Android/) && /Chrome/.test(navigator.userAgent) && !/Version/.test(navigator.userAgent)),
    isAndroidChromeType2:(navigator.userAgent.match(/Android/) && /Chrome/.test(navigator.userAgent)),
    isIE9:(navigator.userAgent.match(/(MSIE\s)([0-9]+\.[0-9]+)/) && ((navigator.userAgent.match(/(MSIE\s)([0-9]+\.[0-9]+)/))? parseFloat(RegExp.$2) : null ) <=9),
    isIE:(navigator.userAgent.match(/(MSIE\s)([0-9]+\.[0-9]+)/) || navigator.userAgent.match(/Trident/)),
    isEdge:navigator.userAgent.match(/Edge/),
    getUniqueArr:function(arr) {
		var storage = {};
		var re = [];
		var i, value;
		for (i = 0; i < arr.length; i++) {
			value = arr[i];
			if (!(value in storage)) {
				storage[value] = true;
				re.push(value);
			}
		}
		return re;
	},
    getArrayShuffle:function(arr) {
        var m = arr.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }
    },
    getWindowSize:function(){
        var r = (window.devicePixelRatio)? window.devicePixelRatio : 1 ;
        var w = window.innerWidth;
        var h = window.innerHeight;
        return {w:w,h:h,r:r};
    },
    getScrollY:function(){
        return (window.scrollY == null)? document.documentElement.scrollTop : window.scrollY ;
    },
    getSpImagePath:function(src){
        var arr = src.split("/");
        if(arr.indexOf("img") !== -1){
            arr.splice(arr.indexOf("img")+1, 0, 'sp');
        } else if(arr.indexOf("works") !== -1){
            arr.splice(arr.indexOf("works")+2, 0, 'sp');
        }
        return arr.join("/");
    },
    getAngle:function(p1,p2){
        var angle = Math.atan2((p1.y-p2.y),(p1.x-p2.x))/(Math.PI/180);
        angle = (angle < 0)? 360 - Math.abs(angle) : angle;
        return angle;
    },
    getDirection:function(angle){
        if((angle <= 45 && angle >= 0) || (angle <= 360 && angle >= 315)){
            return 'left';
        } else if(angle >= 135 && angle <= 225){
            return 'right';
        } else if(angle > 45 && angle < 135){
            return 'down';
        } else {
            return 'up';
        }
    },
    getUrlVars:function(_search){
        var search = (_search)? _search : location.search ;
        var vars = {};
        var param = search.substring(1).split('&');
        for(var i = 0; i < param.length; i++) {
            var keySearch = param[i].search(/=/);
            var key = '';
            if(keySearch != -1) key = param[i].slice(0, keySearch);
            var val = param[i].slice(param[i].indexOf('=', 0) + 1);
            if(key != '') vars[key] = decodeURI(val);
        }
        return vars;
    },
    getFormatDate:function (date, format) {
        if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        if (format.match(/S/g)) {
            var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
            var length = format.match(/S/g).length;
            for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
    },
    anchor:function(){
        var h= $(this).attr("href");
        var t = $(h == "#" || h == "" ? 'html' : h);
        var p = t.offset().top;
        Util.setWindowScroll(p);
        return false;
    },
    setWindowScroll:function(_scrollTop){
        $("html,body").stop(true,false).animate({scrollTop:_scrollTop}, 350, 'swing');
    },
	setAnchor:function(_taregt){
        var t = (_taregt)? _taregt : "body";
		$('a[href^="#"]',t).bind("click",Util.anchor);
	},
    clearAnchor:function(_taregt){
        var t = (_taregt)? _taregt : "body";
        $('a[href^="#"]',t).unbind("click",Util.anchor);
    },
    setOsName:function(){
        var name = "";
        if(navigator.platform.indexOf("Win") != -1){
            name = "windows";
        }
        $("html").addClass(name);
    },
    setBrowserName:function(){
        var name = "";
        if(navigator.userAgent.match(/(firefox)/i)){
            name = "firefox";
        } else if(Util.isIE) {
            name = "ie";
        } else if(Util.isEdge){
            name = "edge";
        } else if(navigator.userAgent.match(/(webkit)/i)){
            name = "webkit";
        }
        $("html").addClass(name);
    }
};

var ImageLoadClass = function(t){
    var _this = this;
    var target = (t==null)? "body" : t ;
    var par = 0;
    var loadCount = 0;
    var arr = [];
    var objArr = [];
    var count = 0;
    var isRemove = false;
    this.ONPROGRESS = "onProgress";
    this.ONLOADEND = "onLoadEnd";
    this.jq = $(this);
    this.bind = function(evt,func){this.jq.bind(evt,func);}
    this.unbind = function(evt,func){this.jq.unbind(evt,func);}

    this.addImg = function(a){
        arr = arr.concat(a);
    }

    this.onLoad = function(){
        count = 0;
        $("img",target).each(function(){
            var s = $(this).attr("src");
            if(s != null) arr.push(s);
        });

        $("*",target).each(function(){
            var b = $(this).css('background-image').match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+[a-z]/g);
            if(b != null) arr.push(b[0]);
        });

        arr = Util.getUniqueArr(arr);

        for(var i = 0; i<arr.length; i++){
            var imgObj = new Image();
            imgObj.src = arr[i];
            imgObj.onload = function(){
                count++;
                _this.jq.trigger(_this.ONPROGRESS,{par:count/objArr.length});
            }
            imgObj.onerror = function(){
                count++;
                _this.jq.trigger(_this.ONPROGRESS,{par:count/objArr.length});
            }
            objArr.push(imgObj);
        }
        var tId;
        var checkFunc = function(){
            if(isRemove){
                clearTimeout(tId);
                return;
            }
            if(count == objArr.length){
                clearTimeout(tId);
                _this.jq.trigger(_this.ONLOADEND);
            }
        }
        tId = setInterval(checkFunc,100);
    }

    this.onRemove = function(){
        isRemove = true;
        for(var o in objArr) objArr[o] = null;
        objArr = null;
        for(var a in arr) arr[a] = null;
        arr = null;
        this.jq = null;
        _this = null;
    }

    return this;
}

var ImageChangeClass = function(){
    var parent = new BaseClass();
    parent.EVENT_LOADEND = "eventLoadend";
    var spSize = Util.BREAK_POINT;
    var target,windowSize;

    var items,nMax = 0,count = 0,imgObj = [];

    parent.onStart = function(_target){
        target = (_target)? _target : "body";
        items = $(target+" .js-imgchange");
        parent.onChangeBreakPoint();
    }

    parent.onChangeBreakPoint = function(){
        if(!items) return;

        for(var k in imgObj){
            imgObj[k].onload = null;
            imgObj[k].onerror = null;
        }
        imgObj = [];
        count = 0;
        nMax = 0;
        items.each(function(index, element) {
            var _this = $(this);
            var src = _this.attr("data-src");
            var cl = _this.attr("class");
            if(!src) return true;
            var cSrc = null;
            if(windowSize.w <= spSize && cl.indexOf("onlyPc") === -1) {
                var spsrc = _this.attr("data-sp_src");
                cSrc = (spsrc)?spsrc : Util.getSpImagePath(src);
                _this.attr('src', cSrc);
            } else if(cl.indexOf("onlySp") === -1){
                _this.attr('src', src);
                cSrc = src;
            }

            if(!cSrc) return true;
            nMax++;

            var callback = function(a,b,c){
                count++;
                _this.css({visibility:"visible"});
                if(count >= nMax){
                    parent.jq.trigger(parent.EVENT_LOADEND);
                }
            }
            imgObj[index] = new Image();
            imgObj[index].onload = callback;
            imgObj[index].onerror = callback;
            imgObj[index].src = cSrc;
        });
    }

    parent.onResize = function(size){
        windowSize = size;
    }

    return parent;
}

var ImageChangeBackgroundClass = function(){
    var parent = new BaseClass();
    var spSize = Util.BREAK_POINT;
    var target,windowSize;

    var items;

    parent.onStart = function(_target){
        target = (_target)? _target : "body";
        items = $(target+" .js-imgchange_background");
        parent.onChangeBreakPoint();
    }

    parent.onChangeBreakPoint = function(){
        if(!items) return;

        items.each(function(index, element) {
            var _this = $(this);
            var src = _this.attr("data-src");
            var cl = _this.attr("class");
            if(!src) return true;
            if(windowSize.w <= spSize && cl.indexOf("onlyPc") === -1) {
                var spsrc = _this.attr("data-sp_src");
                var cSrc = (spsrc)?spsrc : Util.getSpImagePath(src);
                _this.css({'background-image': 'url('+cSrc+')'});
            } else if(cl.indexOf("onlySp") === -1){
                _this.css({'background-image': 'url('+src+')'});
            }
        });
    }

    parent.onResize = function(size){
        windowSize = size;
    }

    return parent;
}

var ModalBase = function(target){
    var parent = new BaseClass();
    parent.EVENT_OPEN = "eventOpen";
    parent.EVENT_CLOSE = "eventClose";
    var easing = "easeOutCubic";
    var time = 300;
    var $bg,$window,$close;
    var timerId;
    var scrollTop = 0;
    parent.isOpen = false;
    parent.isOpenBefore = false;
    parent.target = null;
    parent.super = {};

    function onCreate(){
        parent.target = $(target);
        $window = $(".window",parent.target);
        $bg = $(".bg",parent.target);
        $bg.bind("click",function(){
            parent.onClose();
            return false;
        });
        $close = $(".close",parent.target);
        $close.bind("click",function(){
            parent.onClose();
            return false;
        });
        $window.css({opacity:0});
        $bg.css({opacity:0});
        $close.css({opacity:0});
    }

    function onOpen(b){
        scrollTop = Util.getScrollY();
        parent.isOpen = true;
        parent.isOpenBefore = true;
        parent.target.css({display:"block"});
        timerId = setTimeout(function(){
            $close.stop(true,false).animate({opacity:1},time,easing);
            $bg.stop(true,false).animate({opacity:1},time,easing);
            $window.stop(true,false).animate({opacity:1},time,easing,function(){
                if(parent.isOpenBefore){
                    parent.onOpenAfter();
                    parent.jq.trigger(parent.EVENT_OPEN);
                }
            });
        },10);
        var p = ($("html").attr("class").indexOf("windows") != -1)? window.innerWidth - document.body.clientWidth : 0 ;
        if(!b) {
            $("body").css({overflow:"hidden","padding-right":p});
        }
    }

    function onClose(b){
        if(Util.isBreakpoint && !b) $('html,body').css({overflow:"visible"}).scrollTop(scrollTop);
        clearTimeout(timerId);
        parent.isOpenBefore = false;
        $close.stop(true,false).animate({opacity:0},time,easing);
        $bg.stop(true,false).animate({opacity:0},time,easing);
        $window.stop(true,false).animate({opacity:0},time,easing,function(){
            parent.target.css({display:"none"});
            $close.removeAttr("style");
            $bg.removeAttr("style");
            $window.removeAttr("style");
            parent.isOpen = false;
            parent.onCloseAfter();
            if(!b) {
                $("body").css({overflow:"visible","padding-right":0});
            }
            parent.jq.trigger(parent.EVENT_CLOSE);
        });
        return false;
    }

    parent.onCreate = function(){onCreate();}
    parent.super.onCreate = function(){onCreate();}
    parent.onOpen = function(b){onOpen(b);}
    parent.super.onOpen = function(b){onOpen(b);}
    parent.onOpenAfter = function(){};
    parent.onClose = function(b){ onClose(b);}
    parent.super.onClose = function(b){ onClose(b);}
    parent.onCloseAfter = function(){}
    return parent;
}

var ModalMovieClass = function(){
    var parent = new ModalBase("#modal_movie");
    var baseSize = {
        width: 960,
        height: 540
    }
    var par = 1;
    var ratio = baseSize.height / baseSize.width;
    var windowSize;
    var $window;

    var addHtml = '<div id="modal_movie" class="modal"><div class="bg"></div><div class="window"></div></div>';

    parent.onCreate = function(){
        if($("#modal_movie").length > 0){
        } else {
            $("body").append(addHtml);
        }

        parent.super.onCreate();
        $(".js-modal_movie").bind("click",onClick);
        $window = $(".window",parent.target);
    }

    parent.onResize = function(ws){
        if(!parent.target) return;
        windowSize = ws;
        var ww = parent.target.width();

        if(Util.isBreakpoint){
            par = 0.893;
        } else {
            par = 0.666;
        }

        var w = ww * par;
        var h = w * ratio;
        if(windowSize.h < h+h/2){
            if(Util.isBreakpoint){ par = 0.5; }
            h = windowSize.h * par;
            w = h / ratio;
        }

        $window.css({width:w,height:h,margin:"-"+Math.ceil(h/2)+"px 0 0 -"+Math.ceil(w/2)+"px"});
    }

    parent.onOpen = function(_vid){
        var iframe = '<iframe src="//www.youtube.com/embed/'+_vid+'?rel=0&vq=hd720&autoplay=1"></iframe>';
        $window.prepend(iframe);
        $("body").css({overflow:"hidden"});
        parent.super.onOpen();
    }

    parent.onClose = function(){
        parent.super.onClose();
        $("iframe",$window).remove();
        $("body").css({overflow:"visible"});
    }

    function onClick(){
        var _this = $(this);
        $("p",$window).text($("p",_this).text());
        parent.onResize(Util.getWindowSize());
        parent.onOpen(_this.attr("data-vid"));
        return false;
    }

    return parent;
}

var YoutubePlayerClass = function(_tid,_vid){
    var parent = new BaseClass();
    var tid = _tid,player = null;
    var vid = _vid;
    var isPlay = false;
    var isPlayerReady = false;
    var pauseTimer;

    parent.EVENT_READY = "eventReady";
    parent.EVENT_UNSTARTED = "eventUnstarted";
    parent.EVENT_PLAYING = "eventPlaying";
    parent.EVENT_BUFFERING = "eventbuffering";

    parent.onCreate = function(){
        var isEmbed = true;
        var src = "https://www.youtube.com/iframe_api";
        $("script").each(function(index, element) {
            if($(this)[0].src == src){
                isEmbed = false;
                return;
            }
        });
        if(isEmbed){
            var tag = document.createElement('script');
            tag.src = src;
            tag.async = true;
            tag.defer = true;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    parent.onYouTubeIframeAPIReady = function(){
        var vars = { rel:0,wmode: 'transparent',modestbranding:1,controls:0,showinfo:0,playsinline:1,autoplay:1 };
        var size = {w:560,h:315};
        player = new YT.Player(tid,{
            width: size.w,
            height: size.h,
            videoId: vid,
            playerVars: vars,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    parent.onStart = function(){
        if(isPlay || !isPlayerReady) return;
        if(isPlayerReady) {
            player.mute();
            player.playVideo();
        }
        isPlay = true;
    }

    parent.onStop = function(){
        if(!isPlay || !isPlayerReady) return;
        clearTimeout(pauseTimer);
        if(isPlayerReady) player.pauseVideo();
        isPlay = false;
    }

    parent.onToggle = function(){
        if(isPlay){
            parent.onStop();
            isPlay = true;
        } else {
            parent.onStart();
            isPlay = false;
        }
    }

    parent.getCurrentTime = function(){
        return player.getCurrentTime();
    }

    parent.getDuration = function(){
        return player.getDuration();
    }

    parent.onRemove = function(){

    }

    function onPlayerReady(event) {
        isPlayerReady = true;
        if(isPlay) {
            player.mute();
            player.playVideo();
        }
        if(!Util.isBreakpoint) player.setPlaybackQuality("highres");
        parent.jq.trigger(parent.EVENT_READY,player);
    }

    function onPlayerStateChange(event) {
        if(event.data === YT.PlayerState.PLAYING) {
            isPlay = true;
            parent.jq.trigger(parent.EVENT_PLAYING);
        } else if(event.data === YT.PlayerState.PAUSED) {
            if(Util.isSafari){
                if(isPlay) {
                    pauseTimer = setTimeout(function(){player.playVideo();},800);
                }
            }
        } else if(event.data === YT.PlayerState.ENDED){
            isPlay = false;
            parent.onStart();
        }
    }

    return parent;
}

var BaseSectionAnimationClass = function(_target){
    var parent = new SectionBaseClass(_target);
    parent.inheritance = {};
    var $h2,$body;
    function onCreate(){
        parent.super.onCreate();
        $h2 = $("h2",parent.target);
        $body = $(".body",parent.target);
        var css = {opacity:0,y:Util.BASE_YPOS};
        $h2.css(css);
        $body.css(css);
    }

    function onActive(){
        $h2.animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
        $body.delay(Util.BASE_TIME/4).animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
    }

    parent.onCreate = function(){ onCreate(); }
    parent.inheritance.onCreate = function(){ onCreate(); }
    parent.onActive = function(){ onActive(); }
    parent.inheritance.onActive = function(){ onActive(); }

    return parent;
}

var BaseAnimationClass = function(_target){
    var parent = new SectionBaseClass(_target);
    parent.onCreate = function(){
        parent.super.onCreate();
        parent.target.css({opacity:0,y:Util.BASE_YPOS});
    }

    parent.onActive = function(){
        parent.target.animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
    }
    return parent;
}

var BaseAnimationNextSetClass = function(_target){
    var parent = new SectionBaseClass(_target);
    var $next;
    parent.onCreate = function(){
        parent.super.onCreate();

        $next = parent.target.next();

        parent.target.css({opacity:0,y:Util.BASE_YPOS});
        if($next) $next.css({opacity:0,y:Util.BASE_YPOS});
    }

    parent.onActive = function(){
        parent.target.animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
        if($next) $next.delay(Util.BASE_TIME/4).animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
    }
    return parent;
}

var BaseAnimationManagerClass = function(){
    var parent = new BaseClass();
    var items;
    parent.onCreate = function(){
        items = [];
        $(".js-anim").each(function(){
            items.push(new BaseAnimationClass($(this)));
        });
        $(".js-anim_nextset").each(function(){
            items.push(new BaseAnimationNextSetClass($(this)));
        });
        for(var k in items)items[k].onCreate();
    }

    parent.onLoad = function(){
        for(var k in items)items[k].onLoad();
    }

    parent.onResize = function(size){
        for(var k in items)items[k].onResize(size);
    }

    parent.onScroll = function(st){
        for(var k in items)items[k].onScroll(st);
    }

    parent.onRemove = function(){
        for(var k in items)items[k].onRemove();
    }

    return parent;
}

var PjaxPageClass = function(){
    var parent = new BaseClass();

    parent.parts = {};
    function onCreate(){
        Util.setAnchor("#main");
        parent.parts.baseanimationmanagerclass = new BaseAnimationManagerClass();
        for(var k in parent.parts) parent.parts[k].onCreate();
    }

    function onLoad(){
        parent.onScroll(0);
        for(var k in parent.parts) parent.parts[k].onLoad();
    }

    function onResize(size){
        for(var k in parent.parts) parent.parts[k].onResize(size);
    }

    function onScroll(st){
        for(var k in parent.parts) parent.parts[k].onScroll(st);
    }

    function onRemove(){
        Util.clearAnchor("#main");
        for(var k in parent.parts) parent.parts[k].onRemove();
    }

    function onChangeBreakPoint(){
        for(var k in parent.parts) parent.parts[k].onChangeBreakPoint();
    }

    function onYouTubeIframeAPIReady(){
        for(var k in parent.parts) parent.parts[k].onYouTubeIframeAPIReady();
    }

    function onGoogleMapCallback(){
        for(var k in parent.parts) parent.parts[k].onGoogleMapCallback();
    }

    parent.onCreate = function(){ onCreate(); }
    parent.super.onCreate = function(){ onCreate(); }
    parent.onLoad = function(){ onLoad(); }
    parent.super.onLoad = function(){ onLoad(); }
    parent.onResize = function(size){ onResize(size); }
    parent.super.onResize = function(size){ onResize(size); }
    parent.onScroll = function(st){ onScroll(st); }
    parent.super.onScroll = function(st){ onScroll(st); }
    parent.onChangeBreakPoint = function(){ onChangeBreakPoint(); }
    parent.super.onChangeBreakPoint = function(){ onChangeBreakPoint(); }
    parent.onYouTubeIframeAPIReady = function(){ onYouTubeIframeAPIReady(); }
    parent.super.onYouTubeIframeAPIReady = function(){ onYouTubeIframeAPIReady(); }
    parent.onGoogleMapCallback = function(){ onGoogleMapCallback(); }
    parent.super.onGoogleMapCallback = function(){ onGoogleMapCallback(); }
    parent.onRemove = function(){ onRemove(); }
    parent.super.onRemove = function(){ onRemove(); }
    parent.onPjaxPopstate = function(event,e){}
    parent.onFacebookSetEvent = function(){}
    return parent;
}

var PjaxManagerClass = function(){
    var parent = new BaseClass();
    var targetCl,isPjax = false;

    parent.EVENT_PJAX_START = "eventPjaxStart";
    parent.EVENT_PJAX_END = "eventPjaxEnd";
    parent.EVENT_PJAX_ENDBEFORE = "eventPjaxEndBefore";
    parent.EVENT_PJAX_POPSTATE = "eventPjaxPopstate";

    var loadingHtml = '<div id="loader" class="css_loader first"></div>';
    var $loading;

    parent.onCreate = function(cl){
        $(document).on('pjax:popstate',pjaxPopstate);
        $(document).on('pjax:end',pjaxEnd);

        targetCl = cl;

        if($("#loader").length > 0){
        } else {
            $("body").prepend(loadingHtml);
        }
        $loading = $("#loader");
    }

    parent.onResize = function(size){
    }

    parent.pjaxStart = function(href){
        if(Util.isIE9){
            window.location.href = href;
            return;
        }

        isPjax = true;
        loaderChange(true);
        $(targetCl).stop(true,false).animate({opacity:0},150,"easeOutCubic",function(){
            parent.jq.trigger(parent.EVENT_PJAX_START);
            $.pjax({
                scrollTo: false,
                url:href,
                container:targetCl,
                fragment:targetCl
            });
        });
    }

    parent.onRemove = function(){
        $(document).off('pjax:popstate',pjaxPopstate);
        $(document).off('pjax:end',pjaxEnd);
        targetCl = null;
        isPjax = null;
    }

    parent.allLoadingComplete = function(callback){
        $(targetCl).stop(true,false).animate({opacity:1},150,"easeOutCubic",function(){
            if(callback) callback();
            loaderChange(false);
        });
    }

    function pjaxPopstate(e){
        isPjax = true;
        loaderChange(true);
        $(targetCl).stop(true,false).animate({opacity:0},150,"easeOutCubic");
        parent.jq.trigger(parent.EVENT_PJAX_POPSTATE,e);
    }

    function pjaxEnd(e){
        parent.jq.trigger(parent.EVENT_PJAX_ENDBEFORE);
    }

    function loaderChange(b){
        if(b){
            $loading.stop(true,false).css({display:"block"}).animate({opacity:1},300,"easeOutCubic");
        } else {
            $loading.removeClass("first").stop(true,false).animate({opacity:0},300,"easeOutCubic",function(){$(this).css({display:"none"});});
        }
    }

    return parent;
}

var PcGnavClass = function(){
    var parent = new BaseClass();
    var CL_HIDE = "isHide";
    var $target;
    var currentTop = null;
    parent.onCreate = function(){
        $target = $("#header .base");
    }

    parent.onChangeBreakPoint = function(b){
        $target.removeClass(CL_HIDE);
    }

    parent.onPageChange = function(){
        $target.removeClass(CL_HIDE);
    }

    parent.onScroll = function(st){
        if(Util.isBreakpoint || !$target) return;

        if(currentTop === null) currentTop = st;

        if(st > currentTop &&  st > 100){
            $target.addClass(CL_HIDE);
        } else {
            $target.removeClass(CL_HIDE);
        }

        currentTop = st;
    }

    return parent;
}

var SpGnavClass = function(){
    var parent = new BaseClass();
    var CL_ACTIVE = "active";
    var $base,$target,$btn;
    var isOpen = false;
    parent.onCreate = function(){
        $base = $("#header .base");
        $target = $("#nav");
        $btn = $(".nav_toggle");
    }

    parent.onChangeBreakPoint = function(b){
        $("a",$btn).off("click",onClick);
        $("ul li a",$target).off("click",onClick_nav);
        $target.stop(true,false).removeAttr("style");
        $base.stop(true,false).removeAttr("style");
        $btn.removeClass(CL_ACTIVE);
        isOpen = false;
        if(b) {
            $("a",$btn).on("click",onClick);
            $("ul li a",$target).on("click",onClick_nav);
        }
    }

    function onClick_nav(){
        onClose();
    }

    function onClick(){
        if(isOpen){
            onClose();
        } else {
            onOpen();
        }
        return false;
    }

    function onOpen(){
        if(isOpen) return;
        isOpen = true;
        $btn.addClass(CL_ACTIVE);

        $("body").css({overflow:"hidden"});
        $base.stop(true,false).animate({height:"100%"},300,"easeOutCubic");
        $target.stop(true,false).css({display:"block"}).animate({height:"100%"},300,"easeOutCubic",function(){
            $(this).css({overflow:"auto"});
        });
    }

    function onClose(){
        if(!isOpen) return;
        isOpen = false;
        $btn.removeClass(CL_ACTIVE);
        $base.stop(true,false).animate({height:"0%"},300,"easeOutCubic");
        $target.stop(true,false).animate({height:"0%"},300,"easeOutCubic",function(){
            $(this).css({display:"none",overflow:"hidden"});
            $("body").css({overflow:"visible"});
        });
    }

    return parent;
}

var FacebookNewsClass = function(){
    var parent = new BaseClass();
    parent.isLoad = false;
    var json;
    parent.onCreate = function(){
        FB.api(
            '/kickworld7',
            'GET',
            {
                "access_token":"1609567179115835|b6U8T_afuikXRvGbtt7Q3U2B8nE",
                "fields":"feed.limit(10){message,created_time,permalink_url}"
            },
            function(response) {
                parent.isLoad = true;
                json = response.feed.data;

                parent.onSet();
            }
        );
    }

    parent.onSet = function(_target){
        var $parent = (_target)? $(_target) : $("body");
        var d;
        for(var i = 0; i<json.length; i++){
            if(json[i].message){
                if(json[i].message.indexOf("■タイトル") !== -1 && json[i].message.indexOf("■展開施策") !== -1){
                    d = json[i];
                    break;
                }
            }
        }

        if(d){
            var dataStr = d.created_time.split("T");
            var str1 = dataStr[0].split("-");
            var time = str1.join("/");
            var messageArr = d.message.split(/\r\n|\r|\n/);

            var num1 = messageArr.indexOf("■タイトル");
            var num2 = messageArr.indexOf("■展開施策");
			var num3 = messageArr.indexOf("■人事インタビュー");
			var num4 = messageArr.indexOf("■お知らせ");
										  

            var message = messageArr.slice(num1+1,num2);

            $(".js-facebook_news",$parent).each(function(){
                var _this = $(this);
                $("p a",_this).attr({href:d.permalink_url});
                $(".date",_this).text(time);
                $(".txt",_this).html(message.join('<br>'));
            });
        }
    }

    return parent;
}

var ParentClass = function(){
    var _this = this;
    var isBlur = false;
    var isCreate = false;
    var isLoad = false;
    var isBreackPointCheckFirst = true;

    this.parts = {};

    function onCreate(){
        isCreate = true;

        Util.isBreakpoint = (Util.getWindowSize().w <= Util.BREAK_POINT);

        Util.setAnchor("#footer");
        Util.setBrowserName();
        Util.setOsName();

        if(Util.isAndroid && !Util.isAndroidChrome) $("html").addClass("isAndroid4");

        _this.onCreate();
        for(var k in _this.parts) _this.parts[k].onCreate();

        onResize();
        if(isLoad) onLoad();
    }

    function onLoad(){
        isLoad = true;
        if(!isCreate) return;
        _this.onLoad();
        for(var k in _this.parts) _this.parts[k].onLoad();
        onResize();
    }

    function onResize(e,b){
        if(!isCreate && !isLoad) return;
        var size = Util.getWindowSize();
        Util.windowSize = size;
        _this.onResize(size);
        for(var k in _this.parts) _this.parts[k].onResize(size);
        checkBreakPoint(size);
        onScroll();
    }

    function onBlur(){
        isBlur = true;
        _this.onBlur();
        for(var k in _this.parts) _this.parts[k].onBlur();
    }

    function onFocus(){
        if(!isBlur) return;
        isBlur = false;
        _this.onFocus();
        for(var k in _this.parts) _this.parts[k].onFocus();
    }

    function onScroll(e){
        var st = Util.getScrollY();
        _this.onScroll(st);
        for(var k in _this.parts) _this.parts[k].onScroll(st);
    }

    function checkBreakPoint(size){
        var b = (size.w <= Util.BREAK_POINT);
        if(b != Util.isBreakpoint || isBreackPointCheckFirst){
            isBreackPointCheckFirst = false;
            Util.isBreakpoint = b;
            _this.onChangeBreakPoint(b);
            for(var k in _this.parts) _this.parts[k].onChangeBreakPoint(b);
        }
    }

    $(onCreate);
    $(window).bind("load",onLoad);
    $(window).bind("resize orientationchange",onResize);
    $(window).bind("blur pagehide",onBlur);
    $(window).bind("focus pageshow",onFocus);
    $(window).bind("scroll",onScroll);
    if(Util.isAndroidChrome){
        document.addEventListener("webkitvisibilitychange", function(e){
            if(document.webkitHidden){
                onBlur();
            } else {
                onFocus();
            }
        });
    }

    this.super = {};
    this.onCreate = function(){}
    this.onLoad = function(){}
    this.onResize = function(size){}
    this.onBlur = function(){}
    this.onFocus = function(){}
    this.onScroll = function(scrollTop){}
    this.onChangeBreakPoint = function(b){}
    return this;
}

var SectionBaseClass = function(targetName){
    var parent = new BaseClass();
    parent.isStart = false;
    parent.isLoad = false;
    parent.isActive = false;
    parent.target = null;
    parent.offset = {top:0,bottom:0};
    parent.scrollTop = 0;
    parent.htmlLast = 0;

    function onCreate(){
        parent.target = (typeof targetName == "string")? $(targetName) : targetName ;
    }

    function onLoad(){
        parent.isLoad = true;
    }

    function onResize(size){
        var s = (Util.isBreakpoint)? 6 : 4 ;
        var wh2 = size.h - size.h/s;
        var offset = $.extend({},parent.target.offset());
        var top = Math.floor(offset.top);
        var bottom = Math.floor(top + parent.target.outerHeight(true) - size.h/2);
        if(bottom <= top) bottom = Math.floor(top + parent.target.outerHeight(true));
        parent.offset = {top:top - wh2,bottom:bottom};

        parent.htmlLast = $("html").outerHeight(true) - size.h - 10;
    }

    function onScroll(st){
        parent.scrollTop = st;
        if(st >= parent.offset.top && st <= parent.offset.bottom) {
            if (!parent.isStart && parent.isLoad) {
                parent.isStart = true;
                parent.onStart();
            }
            if (!parent.isActive && parent.isLoad) {
                parent.isActive = true;
                parent.onActive();
            }
        } else if(st >= parent.htmlLast && st < parent.offset.top){
            if (!parent.isActive && parent.isLoad) {
                parent.isActive = true;
                parent.onActive();
            }
        } else {
            if(parent.isStart && parent.isLoad){
                parent.isStart = false;
                parent.onStop();
            }
        }
    }

    function onRemove(){
        parent.isStart = false;
        parent.isLoad = false;
        parent.isActive = false;
        parent.target = null;
        parent.offset = {top:0,bottom:0};
        parent.scrollTop = 0;
        parent.htmlLast = 0;
    }

    parent.onCreate = function(){ onCreate(); }
    parent.super.onCreate = function(){ onCreate(); }
    parent.onLoad = function(){ onLoad(); }
    parent.super.onLoad = function(){ onLoad(); }
    parent.onResize = function(size){ onResize(size); }
    parent.super.onResize = function(size){ onResize(size); }
    parent.onScroll = function(st){ onScroll(st); }
    parent.super.onScroll = function(st){ onScroll(st); }
    parent.onRemove = function(st){ onRemove(); }
    parent.super.onRemove = function(st){ onRemove(); }
    parent.onStart = function(){}
    parent.onStop = function(){}
    parent.onActive = function(){}
    return parent;
}


var BaseClass = function(){

    this.EVENT_YOUTUBE_READY = "eventYoutubeReady";

    this.super = {};
    this.jq = $(this);
    this.bind = function(evt,func){this.jq.bind(evt,func);}
    this.unbind = function(evt,func){this.jq.unbind(evt,func);}
    this.onCreate = function(){}
    this.onLoad = function(){}
    this.onStop = function(){}
    this.onRemove = function(){}
    this.onResize = function(){}
    this.onScroll = function(){}
    this.onBlur = function(){}
    this.onFocus = function(){}
    this.tickEvent = function(){}
    this.onChangeBreakPoint = function(b){}
    this.tickEvent = function(){}
    this.onDraw = function(){}
    this.postMessage = function(){}
    this.onYouTubeIframeAPIReady = function(){}
    this.onGoogleMapCallback = function(){}
    return this;
}


