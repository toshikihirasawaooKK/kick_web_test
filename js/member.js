var MemberProfileBoxClass = function(_target,_flag){
    var parent = new SectionBaseClass(_target);
    var $next,$next2;
    var isSingle = (_flag === 1);
    parent.onCreate = function(){
        parent.super.onCreate();
        if(!isSingle){
            $next = parent.target.next();
            if($next) $next2 = $next.next();
        }

        var css = {opacity:0,y:Util.BASE_YPOS};
        parent.target.css(css);
        if($next) $next.css(css);
        if($next2) $next2.css(css);
    }

    parent.onActive = function(){
        var css = {opacity:1,y:0};
        parent.target.animate(css,Util.BASE_TIME,Util.BASE_EASING);
        if($next) $next.delay(Util.BASE_TIME/4).animate(css,Util.BASE_TIME,Util.BASE_EASING);
        if($next2) $next2.delay(Util.BASE_TIME/2).animate(css,Util.BASE_TIME,Util.BASE_EASING);
    }
    return parent;
}

var MemberProfileBoxManagerClass = function(){
    var parent = new BaseClass();
    var items;
    parent.onCreate = function(){
        items = [];

        var split = (Util.isBreakpoint)? 1 : 3;
        $("#members.page .profile .body ul li").each(function(index){
            if(index <= 5){

            } else {
                if(index%split === 0) items.push(new MemberProfileBoxClass($(this),split));
            }
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

var MemberProfileSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#members.page .profile.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }

    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var MemberPageClass = function(){
    var parent = new PjaxPageClass();
    parent.parts = {
        s1: new MemberProfileSectionClass(),
        box: new MemberProfileBoxManagerClass()
    };
    return parent;
}