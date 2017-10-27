var IndexDrawStringClass = function(){
    var parent = new SectionBaseClass("#top.page .statement .img");

    var drawSvg;
    parent.onCreate = function(){
        parent.super.onCreate();
        drawSvg = $('svg',parent.target).drawsvg({
            duration:140,
            stagger:70
        });
    }

    parent.onResize = function(size){
        var s = (Util.isBreakpoint)? 6 : 6 ;
        var wh2 = size.h - size.h/s;
        var offset = $.extend({},parent.target.offset());
        var top = Math.floor(offset.top);
        var bottom = Math.floor(top + parent.target.outerHeight(true)/2);
        parent.offset = {top:top - wh2,bottom:bottom};

        parent.htmlLast = $("html").outerHeight(true) - size.h - 10;
    }

    parent.onActive = function(){
        drawSvg.drawsvg('animate');
    }

    return parent;
}

var IndexEffectThunderClass = function(){
    var parent = new BaseClass();
    var CL_CLASS = "thunder";
    var stageSize;
    var $target,$me;
    var posArr;

    var timerId;
    var isLoop = false;

    parent.onCreate = function(_target){
        $target = _target;
    }

    parent.onResize = function(size){
        stageSize = size;
    }

    parent.onStart = function(){
        var html = '<div class="'+CL_CLASS+'"></div>';
        posArr = [];

        $target.append(html);
        $me = $("."+CL_CLASS,$target);

        isLoop = true;
        loopStart();
    }

    parent.onStop = function(){
        loopStop();
    }

    parent.onRemove = function(){
        if($me){
            $me.stop(true,false);
            $me = null;
        }
        loopStop();
    }

    function loopStart(){
        if(!isLoop) return;
        var time = Math.floor(Math.random()*5000)+5000;
        timerId = setTimeout(function(){
            run();
        },time);
    }

    function loopStop(){
        isLoop = false;
        clearTimeout(timerId);
    }

    function run(){
        $me.css({opacity:1})
            .animate({opacity:0},100,"easeInQuart",function(){
                $(this) .css({opacity:1});
            })
            .animate({opacity:0.8},100,"easeInQuart")
            .animate({opacity:0},600,"easeInQuart",function(){
                if(isLoop) loopStart();
            });
    }

    return parent;
}

var IndexEffectSnowClass = function(){
    var parent = new BaseClass();
    var CL_CLASS = "snow";
    var INT_MAX = 100;
    var DROP_SIZE = {w:10,h:10};
    var stageSize;
    var $target,$drop;
    var posArr;
    parent.onCreate = function(_target){
        $target = _target;
    }

    parent.onResize = function(size){
        stageSize = size;
    }

    parent.onStart = function(_flag){
        var html = "";
        posArr = [];
        var maxNum = (_flag)? INT_MAX/2 : INT_MAX;

        for(var i=0;i<maxNum; i++){
            html += '<div class="'+CL_CLASS+'"></div>';
        }

        $target.append(html);
        $drop = $("."+CL_CLASS,$target);
        $drop.each(function(i){
            var _this = $(this);
            var l = Math.random()*stageSize.w;
            var t = Math.random()*stageSize.h;
            var s = Math.random()*0.9 + 0.1;
            var r = (Math.random()*1 > 0.5)? 1 : -1;
            _this.css({x:l,y:t,scale:s});
            posArr[i] = {x:l,y:t,scale:s,direction:r};
        });
    }

    parent.onDraw = function(){

        $drop.each(function(i){
            var _this = $(this);
            posArr[i].y += 1*posArr[i].scale;
            posArr[i].x += 0.1*posArr[i].scale * posArr[i].direction;
            _this.css(posArr[i]);

            if(posArr[i].y > stageSize.h + 10){
                posArr[i].y = (DROP_SIZE.h + 10) * -1;
                posArr[i].x = Math.random()*stageSize.w;
                _this.css(posArr[i]);
            }
        });
    }
    return parent;
}

var IndexEffectRainClass = function(){
    var parent = new BaseClass();
    var CL_CLASS = "rain";
    var INT_MAX = 100;
    var DROP_SIZE = {w:1,h:89};
    var stageSize;
    var $target,$drop;
    var posArr;
    parent.onCreate = function(_target){
        $target = _target;
    }

    parent.onResize = function(size){
        stageSize = size;
    }

    parent.onStart = function(_flag){
        var html = "";
        posArr = [];
        var maxNum = (_flag)? INT_MAX/2 : INT_MAX;

        for(var i=0;i<maxNum; i++){
            html += '<div class="'+CL_CLASS+'"></div>';
        }

        $target.append(html);
        $drop = $("."+CL_CLASS,$target);
        $drop.each(function(i){
            var _this = $(this);
            var l = Math.random()*stageSize.w;
            var t = Math.random()*stageSize.h;
            var s = Math.random()*0.75 + 0.25;
            _this.css({x:l,y:t,scale:s});
            posArr[i] = {x:l,y:t,scale:s};
        });
    }

    parent.onDraw = function(){

        $drop.each(function(i){
            var _this = $(this);
            posArr[i].y += 10*posArr[i].scale;
            _this.css(posArr[i]);

            if(posArr[i].y > stageSize.h + 10){
                posArr[i].y = (DROP_SIZE.h + 10) * -1;
                posArr[i].x = Math.random()*stageSize.w;
                _this.css(posArr[i]);
            }
        });
    }

    return parent;
}

var IndexMainVisualEffectClass = function(){
    var parent = new BaseClass();
    var $parentTarget,$target,$bg;
    var data;
    var isDraw = false;
    var effect = {
        rain:new IndexEffectRainClass(),
        snow:new IndexEffectSnowClass(),
        thunder:new IndexEffectThunderClass()
    };
    var runEffect = [];

    parent.onCreate = function(_parentTarget){
        $parentTarget = _parentTarget;
        $target = $(".effect",$parentTarget);
        $bg = $(".bg",$parentTarget);
        for(var k in effect) effect[k].onCreate($target);
    }

    parent.onResize = function(size){

        var width = size.w;
        var height = $("#top.page .statement.section").offset().top;
        var baseSize = {w:width,h:height};

        var offset = $("#top.page").offset();

        var top = offset.top * -1;
        var left = offset.left * -1;
        if(Util.isBreakpoint) left = 0;

        $target.css({width:width,height:height,top:top,left:left});
        $bg.css({width:width,height:height,top:top,left:left});
        for(var k in effect) effect[k].onResize(baseSize);
    }

    parent.setWether = function(_data){
        data = _data;

        if(runEffect.length > 0){
            for(var k in runEffect) effect[runEffect[k]].onStop();
        }

        var urlVar = Util.getUrlVars();
        var telop = "";
        if(!urlVar || !urlVar.w){
            telop = data.weather;
        } else {
            switch (urlVar.w){
                case WEATHER_Utill.TYPE_CLEAR:
                    telop = WEATHER_Utill.TYPE_CLEAR;
                    break;
                case WEATHER_Utill.TYPE_CLOUD:
                    telop = WEATHER_Utill.TYPE_CLOUD;
                    break;
                case WEATHER_Utill.TYPE_RAIN:
                    telop = WEATHER_Utill.TYPE_RAIN;
                    break;
                case WEATHER_Utill.TYPE_THUNDER:
                    telop = WEATHER_Utill.TYPE_THUNDER;
                    break;
                case WEATHER_Utill.TYPE_SNOW:
                    telop = WEATHER_Utill.TYPE_SNOW;
                    break;
            }
        }
        runEffect = [];

        if(telop.indexOf(WEATHER_Utill.TYPE_THUNDER) !== -1) runEffect.push(WEATHER_Utill.TYPE_THUNDER);
        if(telop.indexOf(WEATHER_Utill.TYPE_SNOW) !== -1) runEffect.push(WEATHER_Utill.TYPE_SNOW);
        if(telop.indexOf(WEATHER_Utill.TYPE_RAIN) !== -1) runEffect.push(WEATHER_Utill.TYPE_RAIN);

        if(runEffect.length > 0)$target.fadeIn();
        if(telop !== WEATHER_Utill.TYPE_CLEAR)$bg.fadeIn();

        for(var k in runEffect) effect[runEffect[k]].onStart((runEffect.indexOf(WEATHER_Utill.TYPE_SNOW) !== -1 && runEffect.indexOf(WEATHER_Utill.TYPE_RAIN) !== -1));

        onStart_draw();
    }

    parent.onStart = function(){
        onStart_draw();
    }

    parent.onStop = function(){
        onStop_draw();
    }

    parent.onRemove = function(){
        onStop_draw();
        for(var k in effect) effect[k].onRemove();
    }

    function onStart_draw(){
        if(isDraw) return;
        isDraw = true;
        onDraw();
    }

    function onStop_draw(){
        if(!isDraw) return;
        isDraw = false;
        window.cancelAnimationFrame(onDraw);
    }

    function onDraw(){
        for(var k in runEffect) effect[runEffect[k]].onDraw();
        if(isDraw) window.requestAnimationFrame(onDraw);
    }

    return parent;
}

var IndexMainVisualClass = function(){
    var parent = new SectionBaseClass("#top.page .mainvisual");
    var $wrap;
    var youtube;
    var SIZE_MOVE = {w:560,h:315};
    var $movie,$iframe;
    var isApiReady = false;
    var timerId;
    var loopTime = 1000/Util.FPS;
    var isLoop = false;
    var isPlayerVisible = false;
    var isYoutubeApiReady = false;
    var isWeatherReady = false;
    var videoId = "p1luRAyaTNo";
    var youtubeIds = [
        ["Mdx806J4icI","pm5ZAF0vGUA","baSkyk0DcqM"],
        ["xbqUmC_ZYhs","rN38dhYFwRI","K-skJ4flKzg"],
        ["zaWGZepbDIw","fr0_z4801qw","0EKnqUlVdfs"],
        ["-tUzm5G6gqI","BHQj8nvgJlg","BKj0Ge6xDFk"],
        ["jWyohAtesjs","Wr119pD-3F8","JxWlML1ZEwQ"]
    ];

    var effectCl = new IndexMainVisualEffectClass();
    parent.onCreate = function(){
        parent.super.onCreate();
        $wrap = $("#youtube_wrap",parent.target);
        $movie = $("#youtube_wrap .youtube_wrap_inner",parent.target);
        isPlayerVisible = false;
        $movie.css({display:"none",opacity:0});
        isApiReady = false;
        youtube = new YoutubePlayerClass("youtube","p1luRAyaTNo");
        youtube.bind(youtube.EVENT_READY,function(){
            parent.jq.trigger(parent.EVENT_YOUTUBE_READY);
        });
        youtube.onCreate();

        effectCl.onCreate(parent.target);
        isWeatherReady = false;
    }

    parent.onLoad = function(){
        parent.super.onLoad();
        youtube.onStart();
    }

    parent.onChangeBreakPoint = function(){
        if(Util.isBreakpoint){
            SIZE_MOVE = {w:560,h:315};
        } else {
            SIZE_MOVE = {w:890,h:500};
        }
    }

    parent.onResize = function(size){
        parent.super.onResize(size);

        var wt = $wrap.offset().top;
        var height = size.h - wt;

        $wrap.css({height:height});

        var baseSize = {w: Math.floor(parent.target.outerWidth()),h:Math.floor(parent.target.outerHeight(true))};
        if(baseSize.h < 420) baseSize.h = 420;

        var scale = 1;
        if(Util.isBreakpoint){
            scale = baseSize.w/SIZE_MOVE.w;
            if(baseSize.h < SIZE_MOVE.h*scale){
                scale = baseSize.h/SIZE_MOVE.h;
            }
            scale *= 1.05;
        } else {
            scale = baseSize.w/960;
            if(baseSize.h < SIZE_MOVE.h*scale){
                scale = baseSize.h/SIZE_MOVE.h;
            }
            scale *= 1.2;
        }

        var mw = Math.ceil(SIZE_MOVE.w * scale);
        var mh = Math.ceil(SIZE_MOVE.h * scale);

        var top = (baseSize.h-mh)/2;
        var left = (baseSize.w-mw)/2;
        if(!Util.isBreakpoint){
            top += -30*scale;
            left += 15*scale;
        } else {
            top += -30*scale;
        }

        $movie.css({width:mw,height:mh,top:top,left:left});
        if($iframe) $iframe.css({width:mw,height:mh});
        effectCl.onResize(size);
    }

    parent.onYouTubeIframeAPIReady = function(){
        if(isApiReady) return;
        isApiReady = true;
        youtubeStart();
    }

    parent.setWether = function(_data){
        isWeatherReady = true;

        var type = 0;
        var wind_type = 0;
        if(_data && _data.weather){
            effectCl.setWether(_data);
            var weather = _data.weather;
            if(weather.indexOf(WEATHER_Utill.TYPE_CLEAR) !== -1){
                type = 0;
            } else if(weather.indexOf(WEATHER_Utill.TYPE_CLOUD) !== -1){
                type = 1;
            } else if(weather.indexOf(WEATHER_Utill.TYPE_RAIN) !== -1){
                type = 2;
            } else if(weather.indexOf(WEATHER_Utill.TYPE_THUNDER) !== -1){
                type = 3;
            } else if(weather.indexOf(WEATHER_Utill.TYPE_SNOW) !== -1){
                type = 4;
            }

            var wind = _data.wind;
            if(wind <= 1.5){
                wind_type = 0;
            } else if(wind > 1.5 && wind <= 13.8){
                wind_type = 1;
            } else if(wind > 13.8){
                wind_type = 2;
            }
        }

        videoId = youtubeIds[type][wind_type];
        console.log("youtube",videoId);
        youtubeStart();
    }

    parent.onStart = function(){
        youtube.onStart();
        startTimer();
        effectCl.onStart();
    }

    parent.onStop = function(){
        youtube.onStop();
        stopTimer();
        effectCl.onStop();
    }

    parent.onRemove = function(){
        parent.super.onRemove();
        stopTimer();
        youtube.unbind(youtube.EVENT_READY);
        youtube.onRemove();
        youtube = null;

        effectCl.onRemove();
    }

    function youtubeStart(){
        if(!isApiReady || !isWeatherReady) return;
        youtube.setVid(videoId);
        youtube.onYouTubeIframeAPIReady();
        $iframe = $("iframe",$movie);
        parent.onResize(Util.getWindowSize());
    }

    function startTimer(){
        if(isLoop) return;
        isLoop = true;
        timerId = setInterval(function(){
            onEnterFrameEvent();
        },loopTime);
    }

    function stopTimer(){
        if(!isLoop) return;
        isLoop = false;
        clearInterval(timerId);
    }

    function onEnterFrameEvent(){
        var t = youtube.getCurrentTime();
        var d = youtube.getDuration() - 0.5;
        if((t > 0.5 && t <= d) && !isPlayerVisible){
            isPlayerVisible = true;
            $movie.stop(true,false).css({display:"block"}).animate({opacity:1},300);
        } else if(t > d && isPlayerVisible){
            isPlayerVisible = false;
            $movie.stop(true,false).animate({opacity:0},300,function(){$(this).css({display:"none"});});
        }
    }

    return parent;
}

var IndexWeatherClass = function(){
    var parent = new BaseClass();
    parent.EVENT_WEATHER_COMPLETE = "eventWeatherComplete";
    var $target;
    var json;

    var weekChars = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    parent.onCreate = function(){
        $target = $("#top.page .mainvisual .weather");
        $target.css({opacity:0,y:Util.BASE_YPOS});
        onCallApi();
    }

    function onCallApi(){
        $.ajax({
            url:'/php/getweather.php',
            type:'GET',
            dataType:'json',
            timeout:5000,
            complete:function(a,b,c,d){
                onCallApiEnd(a.responseText);
            }
        });
    }

    function onCallApiEnd(_txt){
        try {
            json = JSON.parse(_txt);
        } catch(e){
            parent.jq.trigger(parent.EVENT_WEATHER_COMPLETE,null);
            return;
        }

        var now = new Date(json.dt*1000);
        var date = Util.getFormatDate(now,'YYYY/MM/DD/');
        date += weekChars[now.getDay()];
        var temperature = json.main.temp;
        var wind = json.wind.speed;
        var condition = json.weather[0].main;

        var data = {
            weather:json.weather[0].description,
            temp:temperature,
            wind:wind
        };

        $(".date",$target).html(date);
        $(".location",$target).html('TOKYO/'+condition);
        $(".detail",$target).html('T: '+temperature+'C&deg/W: '+wind+'m/s');

        parent.jq.trigger(parent.EVENT_WEATHER_COMPLETE,data);

        $target.animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
    }

    return parent;
}

var IndexStatementSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#top.page .statement.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var IndexCompanySectionClass = function(){
    var parent = new BaseSectionAnimationClass("#top.page .company.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var IndexFacebookClass = function(){
    var parent = new SectionBaseClass("#top.page .mainvisual .facebook");
    parent.onCreate = function(){
        parent.super.onCreate();
        parent.target.css({opacity:0,y:Util.BASE_YPOS});
    }

    parent.onActive = function(){
        parent.target.animate({opacity:1,y:0},Util.BASE_TIME,Util.BASE_EASING);
    }

    return parent;
}


var IndexPageClass = function(){
    var parent = new PjaxPageClass();

    parent.parts = {
        s1: new IndexStatementSectionClass(),
        s2: new IndexCompanySectionClass(),
        mv: new IndexMainVisualClass(),
        weather: new IndexWeatherClass(),
        drawtxt: new IndexDrawStringClass(),
        fb: new IndexFacebookClass()
    };

    parent.onCreate = function(){
        parent.super.onCreate();
        parent.parts.mv.bind(parent.parts.mv.EVENT_YOUTUBE_READY,function(){
            parent.jq.trigger(parent.EVENT_YOUTUBE_READY);
        });

        parent.parts.weather.bind(parent.parts.weather.EVENT_WEATHER_COMPLETE,function(e,d){
            parent.parts.mv.setWether(d);
        });
    }

    parent.onFacebookSetEvent = function(){
        parent.parts.fb.onFacebookSetEvent();
    }

    parent.onRemove = function(){
        parent.super.onRemove();
        parent.parts.mv.unbind(parent.parts.mv.EVENT_YOUTUBE_READY);
        parent.parts.weather.unbind(parent.parts.weather.EVENT_WEATHER_COMPLETE);
    }
    
    return parent;
}