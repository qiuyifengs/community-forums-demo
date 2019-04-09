// (function ($) {
// 	function init (dom,args) {
// 		if(args.current <= args.pageCount) {
// 			fillHtml(dom,args);
// 			bindEvent(dom,args);
// 		}else{
// 			// alert('请输入正确页码')
// 		}
// 	};
// 	// render html
// 	function fillHtml (dom,args) {
// 		//pre page
// 		if(args.current > 1) {
// 			dom.html('<span class="prevPage"><img class="page_img" src="/images/left.png" alt=""></span>');
// 		}else{
// 			dom.remove('.prevPage');
// 			dom.html('<span class="disabled"><img class="page_img" src="/images/left.png" alt=""></span>');
// 		}
		
// 		// add "..."		
// 		if(args.current !== 1 && args.current >=4 && args.pageCount !==4) {
// 			dom.append('<span class="num">1</span>');
// 		}
		
// 		if(args.current - 2 > 2 && args.pageCount > 5) {
// 			dom.append('<span>...</span>');
// 		}
		
// 		// Number of consecutive pages in the middle
// 		var start = args.current - 2;
// 		var end = args.current + 2;
// 		for(; start <= end; start++) {
// 			if(start <= args.pageCount && start >= 1) {
// 				if(start == args.current) {
// 					dom.append('<span class="current">'+ start+'</span>');
// 				}else {
// 					dom.append('<span class="num">'+start+'</span>');
// 				}
// 			}
// 		}
// 		if(args.current + 2 < args.pageCount-2 && args.pageCount > 5) {
// 			dom.append('<span>...</span>');
// 		}
// 		if(args.current !== args.pageCount && args.current < args.pageCount - 2 && args.pageCount !==4) {
// 			dom.append('<span class="num">'+args.pageCount+'</span>');
// 		}
// 		//next page
// 		if(args.current < args.pageCount) {
// 			dom.append('<span class="nextPage"><img class="page_img" src="/images/right.png" alt=""></span>');
// 		}else{
// 			dom.remove('.nextPage');
// 			dom.append('<span class="disabled"><img class="page_img" src="/images/right.png" alt=""></span>');
// 		}
// 	}
// 	// click event
// 	function bindEvent (dom,args) {
// 		dom.on('click','.num',function () {
// 			var cur = parseInt($(this).text())
// 			changePage (dom,args,cur);
// 		})
// 		dom.on('click','.prevPage',function () {
// 			var cur = parseInt(dom.find('.current').text())
// 			changePage (dom,args,cur - 1);
// 		})
// 		dom.on('click','.nextPage',function () {
// 			var cur = parseInt(dom.find('.current').text())
// 			changePage (dom,args,cur + 1);
// 		})
		
// 	}
// 	//reset render
// 	function changePage (dom,args,page) {
// 		fillHtml(dom,{current:page,pageCount:args.pageCount});
// 		args.backFn(page);
// 	}
	
// 	// Extension plug-in
// 	$.fn.extend({//如果options传值了就用options的值，没传就是默认值
// 		createPage:function (options) {
// 			var args =$.extend({
// 				pageCount:5,
// 				current:1,
// 				backFn:function () {}
// 			},options);
// 			init(this,args);
// 		}
// 	})
// })(jQuery)

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

    //配置参数
    var defaults = {
        total: 0, //数据总条数
        pageSize: 0, // 每页条数
        pageCount: 10, //总页数,默认为9
        current: 1, //当前第几页
        prevCls: 'ghost-pagination-prev', //上一页class
        nextCls: 'ghost-pagination-next', //下一页class
        prevIcon: 'icon-left', //上一页内容
        nextIcon: 'icon-right', //下一页内容
        activeCls: 'ghost-pagination-item-active', //当前页选中状态
        coping: false, //首页和尾页
        isHide: false, //当前页数为0页或者1页时不显示分页
        homePage: '', //首页节点内容
        endPage: '', //尾页节点内容
        keepShowPN: false, //是否一直显示上一页下一页
        mode: 'unfixed', //分页模式，unfixed：不固定页码数量，fixed：固定页码数量
        count: 4, //mode为unfixed时显示当前选中页前后页数，mode为fixed显示页码总数
        jump: false, //跳转到指定页数
        jumpInputCls: 'ghost-jump-input', //文本框内容
        jumpBtnCls: 'ghost-jump-btn', //跳转按钮
        jumpBtn: '跳转', //跳转按钮文本
        callback: function () {} //回调
    };

    var Pagination = function (element, options) {
        //全局变量
        var opts = options, //配置
            current, //当前页
            $document = $(document),
            $obj = $(element); //容器

        /**
         * 设置总页数
         * @param {int} page 页码
         * @return opts.pageCount 总页数配置
         */
        this.setPageCount = function (page) {
            return opts.pageCount = page;
        };

        /**
         * 获取总页数
         * 如果配置了总条数和每页显示条数，将会自动计算总页数并略过总页数配置，反之
         * @return {int} 总页数
         */
        this.getPageCount = function () {
            return opts.total && opts.pageSize ? Math.ceil(parseInt(opts.total) / opts.pageSize) : opts.pageCount;
        };

        /**
         * 获取当前页
         * @return {int} 当前页码
         */
        this.getCurrent = function () {
            return current;
        };

        /**
         * 填充数据
         * @param {int} 页码
         */


		// const previousTemplate = `<li title="上一页" class="ghost-pagination-prev">
		// 										<a class="ghost-pagination-item-link">
		// 											<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-left"></use></svg>
		// 										</a>
		// 									</li>`
		
		// 				const nextPageTemplate = `<li title="下一页" class="ghost-pagination-next">
		// 										<a class="ghost-pagination-item-link">
		// 											<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-right"></use></svg>
		// 										</a>
		// 									</li>`
		
		// 				const jumpPrevTemplate = `<li title="向前5页" class="ghost-pagination-jump-prev ghost-pagination-jump-prev-custom-icon">
		// 											<a class="ghost-pagination-item-link">
		// 												<div class="ghost-pagination-item-container">
		// 													<i class="anticon anticon-double-left ghost-pagination-item-link-icon">
		// 														<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-double-left"></use>
		// 													</i>
		// 													<span class="ghost-pagination-item-ellipsis">•••</span>
		// 												</div>
		// 											</a>
		// 										</li>`
		// 				const jumpNextTemplate = `<li title="向后5页" class="ghost-pagination-jump-next ghost-pagination-jump-next-custom-icon">
		// 											<a class="ghost-pagination-item-link">
		// 												<div class="ghost-pagination-item-container">
		// 													<i class="anticon anticon-double-right ghost-pagination-item-link-icon">
		// 														<svg class="iconSvg" aria-hidden="true"><use xlink:href="#icon-doubleright"></use>
		// 													</i>
		// 													<span class="ghost-pagination-item-ellipsis">•••</span>
		// 												</div>
		// 											</a>
		// 										</li>`


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
            current = parseInt(index) || parseInt(opts.current) //当前页码
            const pageCount = this.getPageCount() // 获取的总页数
            switch (opts.mode) { // 配置模式
				case 'fixed': // 固定按钮模式
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
                case 'unfixed': //不固定按钮模式
                    if (opts.keepShowPN || current > 1) { //上一页
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
                    if (opts.keepShowPN || current < pageCount) { //下一页
                        html += nextHtml
                    } else {
                        if (opts.keepShowPN == false) {
                            $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
                        }
                    }
                    break;
                case 'easy': //简单模式
                    break;
                default:
            }
            // html += opts.jump ? '<input type="text" class="' + opts.jumpInputCls + '"><a href="javascript:;" class="' + opts.jumpBtnCls + '">' + opts.jumpBtn + '</a>' : '';
			// html += opts.jump ? `<li class="ghost-pagination-options">
			// 			<div class="ghost-pagination-options-quick-jumper">
			// 				<input type="text" class="${opts.jumpInputCls}">
			// 			</div>
			// 		</li>` : ''
			$obj.empty().html(html);
        };

        //绑定事件
        this.eventBind = function () {
            var that = this;
            var pageCount = that.getPageCount(); //总页数
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
            //输入跳转的页码
            $obj.on('input propertychange', '.' + opts.jumpInputCls, function () {
                var $this = $(this);
                var val = $this.val();
                var reg = /[^\d]/g;
                if (reg.test(val)) $this.val(val.replace(reg, ''));
                (parseInt(val) > pageCount) && $this.val(pageCount);
                if (parseInt(val) === 0) $this.val(1); //最小值为1
            });
            //回车跳转指定页码
            $document.keydown(function (e) {
                if (e.keyCode == 13 && $obj.find('.' + opts.jumpInputCls).val()) {
                    var index = parseInt($obj.find('.' + opts.jumpInputCls).val());
                    that.filling(index);
                    typeof opts.callback === 'function' && opts.callback(that);
                }
            });
        };

        //初始化
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
        if (typeof parameter == 'function') { //重载
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