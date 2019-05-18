
/**
 * pagination.js 1.5.1
 * A jQuery plugin to provide simple yet fully customisable pagination.
 * @version 1.5.1
 * @author mss
 * @url https://github.com/Maxiaoxiang/jQuery-plugins
 *
 * @调用方法
 * $(selector).pagination(option, callback);
 * -此处callback是初始化调用，option里的callback是点击页码后调用
 * 
 * -- example --
 * $(selector).pagination({
 *     ... // 配置参数
 *     callback: function(api) {
 *         console.log('点击页码调用该回调'); //切换页码时执行一次回调
 *     }
 * }, function(){
 *     console.log('初始化'); //插件初始化时调用该方法，比如请求第一次接口来初始化分页配置
 * });
 */
;
(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        // AMD或CMD
        define(["jquery"], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        //Browser globals
        factory(jQuery);
    }
}(function ($) {

    var defaults = {
        total: 0,
        pageSize: 0, 
        pageCount: 10,
        current: 1, 
        prevCls: 'ghost-pagination-prev', 
        nextCls: 'ghost-pagination-next',
        prevIcon: 'icon-left',
        nextIcon: 'icon-right',
        activeCls: 'ghost-pagination-item-active', 
        coping: false, 
        isHide: false, 
        homePage: '',
        endPage: '',
        keepShowPN: false, 
        mode: 'unfixed', 
        count: 4,
        jump: false,
        jumpInputCls: 'ghost-jump-input',
        jumpBtnCls: 'ghost-jump-btn', 
        jumpBtn: '跳转',
        callback: function () {} 
    };

    var Pagination = function (element, options) {
        var opts = options, 
            current,
            $document = $(document),
            $obj = $(element); 

        /**
         * @param {int} page 
         * @return opts.pageCount
         */
        this.setPageCount = function (page) {
            return opts.pageCount = page;
        };

        /**
         * @return {int} 
         */
        this.getPageCount = function () {
            return opts.total && opts.pageSize ? Math.ceil(parseInt(opts.total) / opts.pageSize) : opts.pageCount;
        };

        /**
         * @return {int} 
         */
        this.getCurrent = function () {
            return current;
        };

        this.filling = function (index) {
			var html = '';
			let prevHtml = `<li title="上一页" class="${opts.prevCls}">
								<a class="ghost-pagination-item-link">
									<svg class="iconSvg" aria-hidden="true"><use xlink:href="#${opts.prevIcon}"></use></svg>
								</a>
							</li>`
			let nextHtml = `<li title="下一页" class="${opts.nextCls}">
								<a class="ghost-pagination-item-link">
									<svg class="iconSvg" aria-hidden="true"><use xlink:href="#${opts.nextIcon}"></use></svg>
								</a>
							</li>`
            current = parseInt(index) || parseInt(opts.current)
            const pageCount = this.getPageCount()
            switch (opts.mode) { 
				case 'fixed':
					html += prevHtml
                    if (opts.coping) {
                        const home = opts.coping && opts.homePage ? opts.homePage : '1'
						html += `<li title="${home}" data-page="1" class="ghost-pagination-item"><a>${home}</a></li>`
                    }
                    var start = current > opts.count - 1 ? current + opts.count - 1 > pageCount ? current - (opts.count - (pageCount - current)) : current - 2 : 1;
                    var end = current + opts.count - 1 > pageCount ? pageCount : start + opts.count;
                    for (; start <= end; start++) {
                        if (start != current) {
							html += `<li title="${start}" data-page="${start}" class="ghost-pagination-item"><a>${start}</a></li>`
                        } else {
                            html += `<li title="${start}" class='ghost-pagination-item ${opts.activeCls}'><a>${start}</a></li>`
                        }
                    }
                    if (opts.coping) {
                        var _end = opts.coping && opts.endPage ? opts.endPage : pageCount;
						html += `<li title="${_end}" data-page="${pageCount}" class="ghost-pagination-item"><a>${_end}</a></li>`
                    }
					html += nextHtml
                    break;
                case 'unfixed':
                    if (opts.keepShowPN || current > 1) { 
						html += prevHtml
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.prevCls) && $obj.find('.' + opts.prevCls).remove();
                        }
                    }
                    if (current >= opts.count + 2 && current != 1 && pageCount != opts.count) {
                        var home = opts.coping && opts.homePage ? opts.homePage : '1';
						html += opts.coping ?  `<li title="向前${home}" class="ghost-pagination-jump-prev ghost-pagination-jump-prev-custom-icon">
													<a class="ghost-pagination-item-link">
														<div class="ghost-pagination-item-container">
															<i class="anticon anticon-double-left ghost-pagination-item-link-icon">
																<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-double-left"></use>
															</i>
															<span class="ghost-pagination-item-ellipsis">•••</span>
														</div>
													</a>
												</li>` : ''
                    }
                    var start = (current - opts.count) <= 1 ? 1 : (current - opts.count);
                    var end = (current + opts.count) >= pageCount ? pageCount : (current + opts.count);
                    for (; start <= end; start++) {
                        if (start <= pageCount && start >= 1) {
							if (start != current) {
								html += `<li title="${start}" data-page="${start}" class="ghost-pagination-item"><a>${start}</a></li>`
							} else {
								html += `<li title="${start}" class='ghost-pagination-item ${opts.activeCls}'><a>${start}</a></li>`
							}
                        }
                    }
                    if (current + opts.count < pageCount && current >= 1 && pageCount > opts.count) {
                        var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
						html += opts.coping ?  `<li title="向后${end}" data-page="${pageCount}" class="ghost-pagination-jump-prev ghost-pagination-jump-prev-custom-icon">
													<a class="ghost-pagination-item-link">
														<div class="ghost-pagination-item-container">
															<i class="anticon anticon-double-left ghost-pagination-item-link-icon">
																<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-doubleright"></use>
															</i>
															<span class="ghost-pagination-item-ellipsis">•••</span>
														</div>
													</a>
												</li>` : ''
                    }
                    if (opts.keepShowPN || current < pageCount) {
                        html += nextHtml
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
                        }
                    }
                    break;
                case 'easy': 
                    break;
                default:
            }
			$obj.empty().html(html);
        };

        this.eventBind = function () {
            var that = this;
            var pageCount = that.getPageCount();
            var index = 1;
            $obj.off().on('click', 'li', function () {
                if ($(this).hasClass(opts.nextCls)) {
                    if ($obj.find('.' + opts.activeCls).text() >= pageCount) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) + 1;
                    }
                } else if ($(this).hasClass(opts.prevCls)) {
                    if ($obj.find('.' + opts.activeCls).text() <= 1) {
                        $(this).addClass('disabled');
                        return false;
                    } else {
                        index = parseInt($obj.find('.' + opts.activeCls).text()) - 1;
                    }
                } else if ($(this).hasClass(opts.jumpBtnCls)) {
                    if ($obj.find('.' + opts.jumpInputCls).val() !== '') {
                        index = parseInt($obj.find('.' + opts.jumpInputCls).val());
                    } else {
                        return;
                    }
                } else {
                    index = parseInt($(this).data('page'));
                }
                that.filling(index);
                typeof opts.callback === 'function' && opts.callback(that);
            });
            $obj.on('input propertychange', '.' + opts.jumpInputCls, function () {
                var $this = $(this);
                var val = $this.val();
                var reg = /[^\d]/g;
                if (reg.test(val)) $this.val(val.replace(reg, ''));
                (parseInt(val) > pageCount) && $this.val(pageCount);
                if (parseInt(val) === 0) $this.val(1);
            });
            $document.keydown(function (e) {
                if (e.keyCode == 13 && $obj.find('.' + opts.jumpInputCls).val()) {
                    var index = parseInt($obj.find('.' + opts.jumpInputCls).val());
                    that.filling(index);
                    typeof opts.callback === 'function' && opts.callback(that);
                }
            });
        };

        this.init = function () {
            this.filling(opts.current);
            this.eventBind();
            if (opts.isHide && this.getPageCount() == '1' || this.getPageCount() == '0') {
                $obj.hide();
            } else {
                $obj.show();
            }
        };
        this.init();
    };

    $.fn.pagination = function (parameter, callback) {
        if (typeof parameter == 'function') { 
            callback = parameter;
            parameter = {};
        } else {
            parameter = parameter || {};
            callback = callback || function () {};
        }
        var options = $.extend({}, defaults, parameter);
        return this.each(function () {
            var pagination = new Pagination(this, options);
            callback(pagination);
        })
    }
}))