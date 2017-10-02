var MainClass = function(){
    var parent = new ParentClass();
    var pjaxManager = new PjaxManagerClass();
    var nowPid,nowHref,windowSize,isFirst = true,isFirstLoading = true;
    var isFirstImageLoad = false;
    var page = {
        index:new IndexPageClass(),
        access:new AccessPageClass(),
        contact:new ContactPageClass(),
        members:new MemberPageClass(),
        recruit:new RecruitPageClass(),
        services:new ServicePageClass(),
        works:new WorksPageClass(),
        worksdetail:new WorksDetailPageClass()
    };

    var isImageLoad = false;
    var isYoutubeReady = false;
    var imageChange = new ImageChangeClass();
    var bgImageChange = new ImageChangeBackgroundClass();

    var spNav = new SpGnavClass();
    var pcNav = new PcGnavClass();
    var fbNews = new FacebookNewsClass();

    var $nav;

    parent.onCreate = function(){
        $nav = $("#nav");
        var youtube = new YoutubePlayerClass();
        youtube.onCreate();

        pjaxManager.onCreate("#pjax_target");
        pjaxManager.bind(pjaxManager.EVENT_PJAX_START,pjaxStart);
        pjaxManager.bind(pjaxManager.EVENT_PJAX_POPSTATE,pjaxStart);
        pjaxManager.bind(pjaxManager.EVENT_PJAX_END,pjaxEnd);
        pjaxManager.bind(pjaxManager.EVENT_PJAX_ENDBEFORE,pjaxEndBefore);
        $(".js-pjax").on("click",onClick_pjax);

        spNav.onCreate();
        pcNav.onCreate();

        $.ajaxSetup({ cache: true });
        $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
            FB.init({
                appId: '1609567179115835',
                version: 'v2.10'
            });
            fbNews.onCreate();
        });

    }

    parent.onLoad = function(){
        imageChange.onStart();
        bgImageChange.onStart();
        isFirstImageLoad = true;
        loadingComplete();
    }

    parent.onResize = function(size){
        imageChange.onResize(size);
        bgImageChange.onResize(size);
        windowSize = size;
        pjaxManager.onResize(size);
        if(nowPid) page[nowPid].onResize(size);
    }

    parent.onScroll = function(st){
        if(nowPid) page[nowPid].onScroll(st);
        pcNav.onScroll(st);
    }

    parent.onChangeBreakPoint = function(b){
        if(nowPid) page[nowPid].onChangeBreakPoint();
        imageChange.onChangeBreakPoint();
        bgImageChange.onChangeBreakPoint();

        spNav.onChangeBreakPoint(b);
        pcNav.onChangeBreakPoint(b);
    }

    parent.onYouTubeIframeAPIReady = function(){
        Util.isYoutubeApiReady = true;
        loadingComplete();
    }

    parent.onGoogleMapCallback = function(){
        Util.isGoogleMapApiReady = true;
        loadingComplete();
    }

    function loadingComplete(){
        if(!isFirstImageLoad || !Util.isYoutubeApiReady || !Util.isGoogleMapApiReady) return;
        pjaxEndBefore();
    }

    function allLoadingComplete(){
        if(!isImageLoad || !isYoutubeReady) return;
        pjaxManager.allLoadingComplete(function(){
            pjaxEnd();
        });
    }

    function onClick_pjax(){
        var href = $(this).attr("href");

        var next;
        if(href.match(/^\//)){
            next = href;
            if(next === "/"){
                next = "/index.html";
            }
        } else {
            var pn = (window.location.pathname).split("/");
            pn.pop();
            pn.push(href);
            next = pn.join("/");
        }

        if(next === nowHref) {
        } else {
            pjaxManager.pjaxStart(next);
        }
        return false;
    }

    function pjaxStart(){
        if(nowPid){
            page[nowPid].onRemove();
        }
    }

    function pjaxEndBefore(){
        isImageLoad = false;
        isYoutubeReady = false;
        $("html,body").scrollTop(0);
        var pid = pathToPid(window.location.pathname);
        var isIndex = (pid === "index");

        imageChange.bind(imageChange.EVENT_LOADEND,function(){
            imageChange.unbind(imageChange.EVENT_LOADEND);
            page[pid].onResize(Util.getWindowSize());
            page[pid].onScroll(Util.getScrollY());
        });

        if(pid){
            imageChange.onStart();
            bgImageChange.onStart();
            if(isIndex){
                page[pid].bind(page[pid].EVENT_YOUTUBE_READY,function(){
                    page[pid].unbind(page[pid].EVENT_YOUTUBE_READY);
                    isYoutubeReady = true;
                    allLoadingComplete();
                });
            } else {
                isYoutubeReady = true;
            }

            page[pid].onCreate();
            page[pid].onResize(Util.windowSize);
            page[pid].onChangeBreakPoint();
            if(Util.isYoutubeApiReady) page[pid].onYouTubeIframeAPIReady();
            if(Util.isGoogleMapApiReady) page[pid].onGoogleMapCallback();
        }

        gnavChange(pid);

        if(isFirst){
            isFirst = false;
        } else {
            $("#pjax_target .js-pjax").on("click",onClick_pjax);
        }

        nowHref = window.location.pathname+window.location.search;

        if(nowHref.match("/$")) nowHref += "index.html";
        nowPid = pid;

        if(fbNews.isLoad){
            fbNews.onSet();
            if(pid) page[pid].onFacebookSetEvent();
        }

        var imgloader = new ImageLoadClass($("#pjax_target"));
        imgloader.bind(imgloader.ONLOADEND,function(){
            isImageLoad = true;
            allLoadingComplete();
            imgloader.onRemove();
            imgloader = null;
        });
        imgloader.onLoad();
    }

    function pjaxEnd(){
        page[nowPid].onLoad();
        page[nowPid].onResize(Util.getWindowSize());
        page[nowPid].onScroll(Util.getScrollY());
    }

    function pathToPid(_pathname){
        var pid,pathname = _pathname;
        if(pathname.match(/^\/$/)) {
            pid = "index";
        } else {
            var path = pathname.split("/");
            var a = path[path.length-1].split(".");
            if(a.length > 0){
                pid = a[0];
                if(pid === "works"){

                } else if(pid.indexOf('works') != -1){
                    pid = "worksdetail";
                }
            }
        }
        return pid;
    }

    function gnavChange(_pid){
        var index = getPidToIndex(_pid);
        $("ul li",$nav).removeClass("active").eq(index).addClass("active");
    }

    function getPidToIndex(_pid){
        var index = -1;
        if(_pid === "worksdetail"){
            return 2;
        }
        $("ul li a",$nav).each(function(i){
            var href = $(this).attr("href");
            if(href.indexOf(_pid) !== -1){
                index = i;
                return false;
            } else if(href === "/" && _pid === "index"){
                index = i;
                return false;
            }
        });
        return index;
    }

    return parent;
}

var pageCl = new MainClass();

function onYouTubeIframeAPIReady(){
    pageCl.onYouTubeIframeAPIReady();
}

function googlemapcallback(){
    pageCl.onGoogleMapCallback();
}