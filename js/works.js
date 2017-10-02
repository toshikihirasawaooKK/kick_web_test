var WorksSortClass = function(){
    var parent = new BaseClass();
    var $target,$sortNav;
    var STATIC_CATEGORY = ["movie","graphic","web","promotion","event","tieup","other"];
    parent.onCreate = function(){
        $target = $("#works .items ul");
        $sortNav = $("#works .sort ul li");
        var urlVars = Util.getUrlVars();

        var category = urlVars.c;
        if(STATIC_CATEGORY.indexOf(category) === -1) category = null;

        var sortNum = 0;
        if(category){
            $("li",$target).each(function(){
                var _this = $(this);
                var d = $(this).attr("data-category");
                if(d.indexOf(category) === -1){
                    _this.hide();
                }
            });
            sortNum = getSortNavIndex(category);
        }
        $sortNav.eq(sortNum).addClass("active");
    }

    function getSortNavIndex(category){
        var index = 0;
        $sortNav.each(function(i){
            var d = $("a",$(this)).attr("data-type");
            if(category == d) {
                index = i;
                return false;
            }
        });
        return index;
    }

    return parent;
}

var WorksPageClass = function(){
    var parent = new PjaxPageClass();

    parent.parts = {
        sort: new WorksSortClass()
    };

    return parent;
}