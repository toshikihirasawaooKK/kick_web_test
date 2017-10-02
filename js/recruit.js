var RecruitToggleBoxClass = function(_target){
    var parent = new BaseClass();
    var CL_ACTIVE = "active";
    var $target = _target;
    var isOpen = false;
    parent.onCreate = function(){
        $(".js-slide_toggle_btn",$target).on("click",onClick);
    }

    parent.onRemove = function(){
        $(".js-slide_toggle_btn",$target).off("click",onClick);
        $(".js-slide_toggle_body",$target).stop(true,false);
        $target.removeClass(CL_ACTIVE);
        $target = null;
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
        $target.addClass(CL_ACTIVE);

        var height = $(".js-slide_toggle_body_inner",$target).outerHeight(true);
        $(".js-slide_toggle_body",$target).stop(true,false).animate({height:height},Util.BASE_TIME,Util.BASE_EASING,function(){
            $(this).css({height:"auto"});
        });
    }

    function onClose(){
        if(!isOpen) return;
        isOpen = false;

        $target.removeClass(CL_ACTIVE);
        $(".js-slide_toggle_body",$target).stop(true,false).animate({height:0},Util.BASE_TIME,Util.BASE_EASING);
    }

    function toTop(){
        var to = $target.offset().top - $("#header .base").outerHeight(true);
        Util.setWindowScroll(to);
    }

    return parent;
}

var RecruitToggleBoxManagerClass = function(){
    var parent = new BaseClass();
    var box;
    parent.onCreate = function(){
        box = [];
        $("#recruit.page .js-slide_toggle").each(function(){
            box.push(new RecruitToggleBoxClass($(this)));
        });

        for(var k in box)box[k].onCreate();
    }

    parent.onRemove = function(){
        for(var k in box)box[k].onRemove();
    }

    return parent;
}

var RecruitMessageSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#recruit.page .message.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var RecruitCareerSectionClass = function(){
    var parent = new BaseSectionAnimationClass("#recruit.page .career.section");
    parent.onCreate = function(){
        parent.inheritance.onCreate();
    }
    parent.onActive = function(){
        parent.inheritance.onActive();
    }
    return parent;
}

var RecruitPageClass = function(){
    var parent = new PjaxPageClass();
    parent.parts = {
        s1: new RecruitMessageSectionClass(),
        s2: new RecruitCareerSectionClass(),
        togglebox: new RecruitToggleBoxManagerClass()
    }
    return parent;
}