!function (window) {
    "use strict";

    let doc = window.document,
        ghostui = {};

    const util = ghostui.util = {
        /**
         * @param string
         */
        parseOptions: function (string) {
            if ($.isPlainObject(string)) {
                return string;
            }

            const start = (string ? string.indexOf('{') : -1);
            let options = {};

            if (start != -1) {
                try {
                    options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
                } catch (e) {
                }
            }
            return options;
        },
        localStorage: function () {
            return storage(window.localStorage);
        }(),
        sessionStorage: function () {
            return storage(window.sessionStorage);
        }(),
        /**
         * @param value
         * @returns {string}
         */
        serialize: function (value) {
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        },
        /**
         * @param value
         * @returns {*}
         */
        deserialize: function (value) {
            if (typeof value !== 'string') return undefined;
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || undefined;
            }
        }
    };
    function storage (ls) {
        return {
            set: function (key, value) {
                ls.setItem(key, util.serialize(value));
            },
            get: function (key) {
                return util.deserialize(ls.getItem(key));
            },
            remove: function (key) {
                ls.removeItem(key);
            },
            clear: function () {
                ls.clear();
            }
        };
    }

    /**
     * @git http://blog.alexmaccaw.com/css-transitions
     * @param duration
     */
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if (typeof define === 'function') {
        define(ghostui);
    } else {
        window.ghostui = ghostui;
    }

}(window);

/**
 * Tab Plugin
 */
!function (window) {
    "use strict";

    function Tab (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Tab.DEFAULTS, options || {});
        this.init();
        this.bindEvent();
        this.transitioning = false;
    }

    Tab.TRANSITION_DURATION = 150;

    Tab.DEFAULTS = {
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    };

    Tab.prototype.init = function () {
        var _this = this,
            $element = _this.$element;

        _this.$nav = $element.find(_this.options.nav);
        _this.$panel = $element.find(_this.options.panel);
    };

    Tab.prototype.bindEvent = function () {
        var _this = this;
        _this.$nav.each(function (e) {
            $(this).on('click.ghostui.tab', function () {
                _this.open(e);
            });
        });
    };

    /**
     * @param index 
     */
    Tab.prototype.open = function (index) {
        var _this = this;

        index = typeof index == 'number' ? index : _this.$nav.filter(index).index();

        var $curNav = _this.$nav.eq(index);

        if (_this.transitioning || $curNav.hasClass(_this.options.activeClass))return;

        _this.transitioning = true;

        $curNav.trigger($.Event('open.ghostui.tab', {
            index: index
        }));

        _this.active($curNav, _this.$nav);

        _this.active(_this.$panel.eq(index), _this.$panel, function () {
            $curNav.trigger({
                type: 'opened.ghostui.tab',
                index: index
            });
            _this.transitioning = false;
        });
    };

    /**
     * @param $element 
     * @param $container 
     * @param callback 
     */
    Tab.prototype.active = function ($element, $container, callback) {
        var _this = this,
            activeClass = _this.options.activeClass;

        var $avtive = $container.filter('.' + activeClass);

        function next () {
            typeof callback == 'function' && callback();
        }

        $element.one('webkitTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION);

        $avtive.removeClass(activeClass);
        $element.addClass(activeClass);
    };

    function Plugin (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var target = this,
                $this = $(target),
                tab = $this.data('ghostui.tab');

            if (!tab) {
                $this.data('ghostui.tab', (tab = new Tab(target, option)));
            }

            if (typeof option == 'string') {
                tab[option] && tab[option].apply(tab, args);
            }
        });
    }

    $(window).on('load.ghostui.tab', function () {
        $('[data-ghostui-tab]').each(function () {
            var $this = $(this);
            $this.tab(window.ghostui.util.parseOptions($this.data('ghostui-tab')));
        });
    });

    $.fn.tab = Plugin;

}(window);

/**
 * Dialog
 */
!function (window, ghostui) {
    "use strict";

    let dialog = ghostui.dialog = ghostui.dialog || {},
        $body = $(window.document.body);

    dialog.loading = function () {

        const ID = 'GHOST_LOADING';

        return {
            /**
             * @param text
             * @param spinner
             * @param background
             */
            open: function () {
                $(`#${ID}`).remove();

                const $dom1 = $(`<div class="ghost-loading-mask" id="${ID}">
                                    <div class="ghost-loading-spinner">
                                        <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                                    </div>
                                </div>`).remove();

                // const $dom2 = $(`<div class="ghost-loading-mask" id="${ID}" style="background-color: ${background}">
                //                     <div class="ghost-loading-spinner">
                //                         <i class="${spinner}"></i>
                //                         <p class="ghost-loading-text">${text || '数据加载中'}</p>
                //                     </div>
                //                 </div>`).remove();
                $body.append(`<div class="ghost-loading-mask" id="${ID}">
                <div class="ghost-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                </div>
            </div>`)
            },
            close: function () {
                $(`#${ID}`).remove();
            }
        };
    }();

}(window, ghostui);


(function ($) {
    $.fn.ghostModel = function (options) {
        return this.each(function () {

            let settings = $.extend({
                skinClassName: '',
                animationType: 'fade-in',
                allowOverlay: true
            }, options)

            let $overlay = $('<div class="ghost-model-overlay"></div>')

            function closeDialog() {
                if(settings.allowOverlay) {
                    $overlay.get(0).remove()
                }
                $dialog.removeClass('show')
            }

            let $dialog = $(this);
            let $content = $('<div class="ghost-model-content"></div>').addClass(settings.skinClassName).append($dialog.html())
            $dialog.empty().append($content).addClass(settings.animationType)

            if(settings.allowOverlay) {
                $overlay.click(closeDialog);
            }

            $dialog.find('[data-dismiss="ghostModel"]').click(closeDialog)

            var $trigger = $('[data-toggle="ghostModel"][data-target=' + $dialog.attr('id') + ']')
            $trigger.click(function () {
                if(settings.allowOverlay) {
                    $('body').append($overlay)
                }
                $dialog.addClass('show')
            })
        })
    }
}(jQuery));

(function ($) {
    'use strict'
    $.fn.backtop = function(opt){
        
        //variables
        const elem = this;
        const win = $(window);
        const doc = $('html, body');
        
        //Extended Options
        let options = $.extend({
            autohide: true,
            offset: 420,
            speed: 500,
            position: true,
            right: 15,
            bottom: 30
        }, opt);
        
        elem.css({
            'cursor': 'pointer'
        });
        
        if(options.autohide){
            elem.css('display', 'none');
        }
        
        if(options.position){
            elem.css({
                'position': 'fixed',
                'right': options.right,
                'bottom': options.bottom,
            })
        }
        
        elem.click(function(){
            doc.animate({scrollTop: 0}, options.speed)
        })
        
        win.scroll(function(){
            let scrolling = win.scrollTop()
            
            if(options.autohide){
                if(scrolling > options.offset){
                    elem.fadeIn(options.speed)
                }
                else elem.fadeOut(options.speed)
            }  
        })   
    }
}(jQuery))