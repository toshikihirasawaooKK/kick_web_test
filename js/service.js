var ServiceGraphClass = function(){
    var parent = new SectionBaseClass("#service.page .tcs.section .body .graph");
    var $img1,$img2,$img3;
    parent.onCreate = function(){
        parent.super.onCreate();

        $img1 = $(".img.i1",parent.target);
        $img2 = $(".img.i2",parent.target);
        $img3 = $(".img.i3",parent.target);

        var css = {opacity:0,y:Util.BASE_YPOS};
        $img1.css(css);
        $img2.css(css);
        $img3.css(css);
    }

    parent.onResize = function(size){
        var wh2 = size.h/2;
        var offset = $.extend({},parent.target.offset());
        var top = Math.floor(offset.top);
        var bottom = Math.floor(top + parent.target.outerHeight(true));
        parent.offset = {top:top - wh2,bottom:bottom};

        parent.htmlLast = $("html").outerHeight(true) - size.h - 10;
    }

    parent.onActive = function(){
        var css = {opacity:1,y:0};
        var time = 800;
        $img2.animate(css,time,Util.BASE_EASING);
        $img3.delay(1000).animate(css,time,Util.BASE_EASING);
        $img1.delay(2000).animate(css,time,Util.BASE_EASING,function(){
            parent.target.addClass("isAnim");
        });
    }

    parent.onRemove = function(){
        parent.super.onRemove();
        $img1.stop(true,false);
        $img2.stop(true,false);
        $img3.stop(true,false);
    }

    return parent;
}

var ServiceServiceSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#service.page .service.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var ServiceTCSSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#service.page .tcs.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var ServicePageClass = function(){
    var parent = new PjaxPageClass();
    parent.parts = {
        s1: new ServiceServiceSectionClass(),
        s2: new ServiceTCSSectionClass(),
        graph: new ServiceGraphClass()
    }
    return parent;
}