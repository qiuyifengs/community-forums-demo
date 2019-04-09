(function($) {
    var defaults = {
        labelTypeArr: [],
        labelArr: [],
        limit: 5,
        resArr: [],
        typeCls: "type-cls",
        activeType: "type-acitved",
        labelCls: "label-cls",
        activeLabel: "label-actived",
        callback: function() {}
    }
    var Tagsinput = function(el, options) {
        var opts = options,
        $document = $(document),
        $obj = $(el);
        this.renderType = function(opts) {
            var typeHtml = '';
            for (let element in opts.labelTypeArr) {   
                typeHtml += `<div class="${opts.typeCls}" id="${opts.labelTypeArr[element].typeId}">${opts.labelTypeArr[element].typeContent}</div>` ;
            };
            var typeParent = `<div class="type-list">${typeHtml}</div>`
            $obj.empty().html(typeParent);
            $(".type-cls").eq(0).addClass("type-acitved")
            this.renderLabel($(".type-cls").eq(0));
        }
        this.renderLabel = function(event) {
            var labelHtml = '';
            $obj.find(".label-list").remove();
            var curId = event.attr("id");
            for (let el in opts.labelTypeArr) { 
                if(opts.labelTypeArr[el].typeId == curId) {
                    opts.labelTypeArr[el].labelArr.forEach(labelItem => {
                        labelHtml += `<li class="${opts.labelCls}" id="${labelItem.labelId}">${labelItem.laebl}</li>`
                    });
                }
            }
            var lebalParent = `<ul class="label-list">${labelHtml}</ul>`
            $obj.append(lebalParent)
        }
        this. typeEventBind = function() {
            var that = this;
            $obj.off().on('click', '.type-cls', function () {
                $(this).addClass("type-acitved");
                $(this).siblings().removeClass("type-acitved");
                that.renderLabel($(this))
            })
        }
        this.labelEventBind = function() {
            var that = this;
            // var hadLabel = false;
            $obj.on('click', '.label-cls', function () {
                var selLabel = {};
                $(this).addClass("label-actived");
                $(this).siblings().removeClass("label-actived");
                selLabel.id = $(this).attr("id");
                selLabel.label = $(this).text();
                // for(var i = 0, len = opts.resArr.length - 1; i < len; i++) {
                //     if (opts.resArr[i].id == selLabel.id) {
                //         hadLabel = true;
                //         return;
                //     } 
                // }
                // if (!hadLabel) opts.resArr.push(selLabel);
                typeof opts.callback === 'function' && opts.callback(selLabel);
            })
        }
        this.init = function() {
            this.renderType(opts);
            this.typeEventBind();
            this.labelEventBind();
        }
        this.init();
    }
    $.fn.tagsinput = function(options, callback) {
        if (typeof options == 'function') {
            callback = options;
            options = {};
        } else {
            options = options || {};
            callback = callback || function () {};
        }
        var options = $.extend({}, defaults, options);
        return this.each(function () {
            var tagsinput = new Tagsinput(this, options);
            callback(tagsinput);
        })
    }
})(jQuery)