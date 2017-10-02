var WorksDetailSlideShowClass = function(_target){
    var parent = new BaseClass();
    var $target = _target;
    var $li;
    var maxNum,nowNum;
    var isMove = false;

    parent.onCreate = function(){
        $li = $("ul li",$target);
        maxNum = $li.length;
        nowNum = 0;

        $li.css({x:"100%"}).eq(nowNum).css({x:"0%"});
        isMove = false;
        $(".nav.next",$target).on("click",onClick_next);
        $(".nav.prev",$target).on("click",onClick_prev);
        if(maxNum <= 1){
            $(".nav",$target).hide();
        }
    }

    parent.onRemove = function(){
        $(".nav.next",$target).off("click",onClick_next);
        $(".nav.prev",$target).off("click",onClick_prev);
    }

    parent.onChangeBreakPoint = function(){
        if(Util.isBreakpoint){
            $li.stop(true,false).css({x:0});
        } else {
            nowNum = 0;
            $li.css({x:"100%"}).eq(nowNum).css({x:"0%"});
            isMove = false;
        }
    }

    function onClick_next(){
        var n = nowNum + 1;
        if(n >= maxNum)n = 0;
        move(n,true);
        return false;
    }

    function onClick_prev(){
        var n = nowNum - 1;
        if(n < 0)n = maxNum-1;
        move(n,false);
        return false;
    }

    function move(n,isRight){
        if(isMove) return;
        isMove = true;
        var nCss = {x:"-100%"};
        var css = {x:"100%"};
        if(!isRight){
            nCss.x = "100%";
            css.x = "-100%";
        }

        $li.eq(n).css(css).animate({x:"0%"},Util.BASE_TIME,Util.BASE_EASING,function(){
            isMove = false;
        });
        $li.eq(nowNum).animate(nCss,Util.BASE_TIME,Util.BASE_EASING);

        nowNum = n;
    }

    return parent;
}

var WorksDetailSlideShowManagerClass = function(){
    var parent = new BaseClass();
    var items;
    parent.onCreate = function(){
        items = [];

        $("#works_detail .js-slide_show").each(function(){
            items.push(new WorksDetailSlideShowClass($(this)));
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

    parent.onChangeBreakPoint = function(){
        for(var k in items)items[k].onChangeBreakPoint();
    }

    return parent;
}

var WorksDetailPageClass = function(){
    var parent = new PjaxPageClass();
    parent.parts = {
        slideshow: new WorksDetailSlideShowManagerClass(),
        vmodal: new ModalMovieClass()
    };
    return parent;
}