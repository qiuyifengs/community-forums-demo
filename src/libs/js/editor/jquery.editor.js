
let global;
function Editor(opt) {
	//功能按钮配置
	this.btns = {
		text: `<span class="J_txtbtn"><svg class="iconSvg iconfont" aria-hidden="true">
				<use xlink:href="#icon-wenzi"></use>
			   </svg><em lang="text">文字</em></span>`,
		pic: `<span class="J_uploadpic">
				<svg class="iconSvg iconfont" aria-hidden="true">
					<use xlink:href="#icon-tupian1"></use>
			    </svg><em lang="imgage">图片</em>
			 </span>`,
		video: `<span class="J_video">
					<svg class="iconSvg iconfont" aria-hidden="true">
						<use xlink:href="#icon-shipin-tianchong"></use>
					</svg><em lang="video">视频</em>
				</span>`,
		link: `<span class="J_link"> 
					<svg class="iconSvg iconfont" aria-hidden="true">
						<use xlink:href="#icon-lianjie-tianchong"></use>
					</svg><em lang="link">链接</em>
				</span>`,
		emoji: `<span class="J_emoji" style="display:none"> 
					<svg class="iconSvg iconfont" aria-hidden="true">
						<use xlink:href="#icon-Ovalx"></use>
					</svg><em lang="emoji">表情</em>
				</span>`,
		clear: `<span class="J_clear"> 
					<svg class="iconSvg iconfont" aria-hidden="true">
						<use xlink:href="#icon-qingkong"></use>
					</svg><em lang="clear">清空</em>
				</span>`
	}

	// 默认配置
	this.config = {
		fn: ['text', 'pic', 'video', 'link', 'emoji', 'clear'],
		debugger: false,
		uploadUrl: "",
		data:"",
		callback: function() {}
	}

	//功能模版
	this.templateInit = function(obj) {
		var _self = this;
		var htm = '<div class="Editor">\
                            <div class="editor_btns">\
                                <div class="J_function">' + (function() {
			var str = [];
			$.each(_self.config.fn, function(i, d) {
				str.push(_self.btns[d]);
			});
			return str.join('');
		}()) + '</div>\
                                <div class="J_tip tip">保存成功</div>\
                            </div>\
                            <div class="J_editor_body editor_body">\
                                <div class="J_text text" data-type="text">\
                                    <div class="J_drag drag">\
										<span lang="text">文字</span><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-menu2"></use></svg> <em lang="move">上下拖拽修改排序</em>\
                                    </div>\
									<textarea placeholder="" spellcheck="false" class="form-control" oninput="keyup(value)" onchange="change()"></textarea>\
									<div class="J_bottom editor_btns"><span class="J_emoji text_emoji"><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-Ovalx"></use></svg><span lang="emoji">表情</span></span><span class="J_del del"><span class="J_delete" lang="delete">删除</span></span></div>\
                                </div>\
                            </div>\
                        </div>';
		$(obj).html(htm);
		// 拖动排序
		$(".J_editor_body").sortable({
			axis: "y"
		});
		// 模块删除
		$(".J_editor_body").on('click', '.J_del', function() {
			if ($('.J_text').length > 1) {
				let delUrl = []
				if ($(this).attr('data-name')) {
					delUrl.push($(this).attr('data-name'))
				}
				if (delUrl.length > 0) {
					let data = {
						urlArr: JSON.stringify(delUrl)
					}
					$(this).parents('.J_text').remove();
					$.ajax({
						data: data,
						url: _self.config.uploadUrl + 'post/deleteUrl',
						type: 'post',
						success: function(res) {
							
							_self.autoSave(_self)
						},
						error: function(e) {
							layer.msg('接口异常', {
								icon: 2
							});
						}
	
					})
				}
			} else {
				layer.msg('至少保留一个输入板块', {
					offset: '290px'
				});
			}
		});
	}

	this.template = function(opt) {
		var htm = '',
			_self = this;
		if (opt.type == "text" || opt.type == 'clear') {
			htm = '<div class="J_text text" data-type="text">\
                                <div class="J_drag drag"><span lang="text">文字</span><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-menu2"></use></svg><em lang="move">上下拖拽修改排序</em></div>\
								<textarea placeholder="" spellcheck="false" class="form-control" oninput="keyup(value)" onchange="change()">' + (opt.value ? opt.value : '') + '</textarea>\
								<div class="J_bottom editor_btns"><span class="J_emoji text_emoji"><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-Ovalx"></use></svg><span lang="emoji">表情</span></span><span class="J_del del"><span class="J_delete" lang="delete">删除</span></span></div>\
                            </div>';
		} else if (opt.type == 'pic') {
			htm = '<div class="J_text text" data-type="pic">\
                                <div class="J_drag drag"><span lang="imgage">图片</span><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-menu2"></use></svg><em lang="move">上下拖拽修改排序</em></div>\
                                <div class="pic_box">\
                                    <div class="pic" data-src="'+opt.url+'" style="background-image: url('+opt.url+'); background-size:cover;"></div>\
                                    <textarea placeholder="添加描述" spellcheck="false" class="form-control add-describe" oninput="keyup(value)" onchange="change()">' + (opt.value ? opt.value : '') + '</textarea>\
									<div class="J_bottom editor_btns"><span class="J_del del" data-name="' + opt.url + '"><span class="J_delete" lang="delete">删除</span></span></div>\
                                </div>\
                            </div>';
		} else if (opt.type == 'video') {
			htm = '<div class="J_text text" data-type="video">\
                                <div class="J_drag drag"><span lang="video">视频</span><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-menu2"></use></svg><em lang="move">上下拖拽修改排序</em></div>\
                                <div class="pic_box">\
                                    <div class="video"><iframe src="' + opt.url + '" frameborder="0" width="100%" height="100% scrolling="no" marginheight="0" marginwidth="0""></iframe></div>\
                                    <textarea placeholder="添加描述" spellcheck="false" class="form-control add-describe" oninput="keyup(value)" onchange="change()">' + (opt.value ? opt.value : '') + '</textarea>\
									<div class="J_bottom"><span class="J_del del" data-name="' + opt.url + '"><span class="J_delete" lang="delete">删除</span></span></div>\
                                </div>\
                            </div>';
		}else if(opt.type == 'link'){
			htm= '<div class="J_text text" data-type="link">\
                                <div class="J_drag drag">\
									<span lang="link">超链接</span><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-menu2"></use></svg> <em lang="move">上下拖拽修改排序</em>\
                                </div>\
                                <div class="link">\
                                    <ul>'+(function(){
                                		var str=[];
                                    	if(opt.url){
                                    		$.each(opt.url,function(i,d){
                                    			str.push('<li><input type="text" name="title" placeholder="标题" value="'+d.title+'" class="form-control link-input link-label"/><input type="text" name="link" value="'+d.link+'" placeholder="链接URL" class="form-control link-url" oninput="keyup(value)" onchange="change()"/><span class="J_delLink J_delete" lang="delete">删除</span></li>')
                                    		})
                                    	}else{
                                    		str.push('<li><input type="text" name="title" placeholder="标题" class="form-control link-label"/><input type="text" name="link" placeholder="链接URL" class="form-control link-input link-url" oninput="keyup(value)" onchange="change()"/><span class="J_delLink J_delete" lang="delete">删除</span></li>');
                                    	}
                                    	return str.join('');
                                    }())+'</ul>\
									<div class="J_addLink btn btn-logo"><svg class="iconSvg iconfont" aria-hidden="true"><use xlink:href="#icon-jia"></use></svg><em lang="add">添加</em></div>\
                                </div>\
                            </div>'
		}
		if (opt.type == 'clear') {
			$(".J_editor_body").html(htm).sortable("refresh");
		} else {
			$(".J_editor_body").append(htm).sortable("refresh");
		}
		translateFun()
	},
	this.videoPromptTemplate = function() {
		var html = '';
		html = `
			<div class="modal_mask">
				<div class="modal_box" >
					<h4 class="modal_title" lang="addVideo">插入视频</h4>  
					<ul class="modal_tab_select">
						<li class="modal_tab_item active" lang="localInsert">本地上传</li>
						<li class="modal_tab_item" lang="rempteUrl">远程地址</li>
					</ul>
					<div class="tab_content">
						<div class="tab_pane sel">
							<p class="tip_text" lang="limitVideo">视频不能超过150M</p>
							<div class="file_btn">
								<span lang="videoFile">选择文件</span>
								<form enctype="multipart/form-data" id="videoFrom">
									<input class="file_inp" type="file" name="file" accept="video/*">
								</form>
							</div>
							<div class="modal_btn_box">
							<button type="button" class="madal_submit madal_local_submit" lang="insert">插入</button>
							<button type="button" class="madal_cancel" lang="cancel">取消</button>
						</div>
						</div>
						<div class="tab_pane">
							<textarea class="video_url" type="text" placeholder="请输入视频url" ></textarea>
							<div class="modal_btn_box">
							<button type="button" class="madal_submit madal_url_submit" lang="insert">插入</button>
							<button type="button" class="madal_cancel" lang="cancel">取消</button>
						</div>
						</div>
					</div>
					
				</div>
			</div>		
		`
		return html
	}
}
let oldVal = null
let time
function keyup(val) {
	if (oldVal != val) {
		console.log(oldVal, val)
		oldVal = val
		clearInterval(time)
	}
	Editor.prototype.autoSave(global)
}
function change() {
	console.log(Editor.prototype)
}
function translate() {
	if (localStorage.getItem('langData') && JSON.parse(localStorage.getItem('langData')).lang == 'en') {
		$('.video_url').attr('placeholder', 'Please enter video URL')
		$('.link-label').attr('placeholder', 'Label')
		$('.link-url').attr('placeholder', 'Link URL')
		$('.add-describe').attr('placeholder', 'Add Describe')
	} else {
		$('.video_url').attr('placeholder', '请输入视频url')
		$('.link-label').attr('placeholder', '标题')
		$('.link-url').attr('placeholder', '链接url')
		$('.add-describe').attr('placeholder', '添加描述')
	} 
}
Editor.prototype = {
	init: function(opt, callback) {
		var _self = this;
		global = opt;
		//debugger配置
		_self.config.debugger = opt && opt.debugger;

		// 传图url地址
		_self.config.uploadUrl = opt && opt.uploadUrl;

		//功能配置
		if (opt.fn) {
			_self.config.fn = opt.fn
		}

		// 初始化编辑器
		_self.templateInit(opt.box);
		if(opt.data){
			$('.J_text').remove();
			$.each(opt.data, function(i, d) {
				_self.template(d);
			});
		}else{
			// _self.autoSave(opt);
			if ('sessionStorage' in window) {
				if (sessionStorage.jStorage) {
					var data = JSON.parse(sessionStorage.jStorage);
					if (data.length) {
						$('.J_text').remove();
						$.each(data, function(i, d) {
							_self.template(d);
						});
					}
				}
			}
		}
		if (typeof opt == 'function') {
            callback = opt;
            opt = {};
        } else {
            opt = opt || {};
            callback = callback || function () {};
		}

		_self.addText();
		_self.addPic(opt);
		_self.addVideo();
		_self.addEmoji(opt.box);
		_self.addLink();
		_self.clearAll();
		_self.addVideoState();
		_self.addVideoUrl(opt);
		_self.cancelVideo();
		var opt = $.extend({}, this.config, opt);
        return $(opt.box).eq(0).each(function () {
			var editor = new Editor(opt);
            callback(editor);
        })
	},
	autoSave: function(opt) {
		var _self = this;
		if ('sessionStorage' in window) {
			time = setInterval(function() {
				let autoSave = false
				for (let i = 0; i < _self.getData().length; i++) {
					if (_self.getData()[i].value != '' && _self.getData()[i].value != '\n' || _self.getData()[i].url != '') {
						autoSave = true;
					}
				}
				if (autoSave) {
					// layer.msg('5秒自动保存成功');
					$('.J_tip').fadeIn('400', function(e) {
						var d = this;
						setTimeout(function() {
							$(d).fadeOut('400');
						}, 1000)
					});
					sessionStorage.jStorage = JSON.stringify(_self.getData());
					typeof opt.callback === 'function' && opt.callback(sessionStorage.jStorage);
					
				}
				clearInterval(time)
			}, 3000);
		}
	},
	log: function(t) {
		if (this.config.debugger) {
			console.log(t);
		}
	},
	addLink:function(){
		var _self = this;
		$('.J_link').click(function() {
			_self.template({
				type: 'link'
			});
			translate()
		});
		$(".J_editor_body").on('click','.J_addLink',function(){
			$(this).prev('ul').append('<li><input type="text" name="title" placeholder="标题" class="form-control link-label"/><input type="text" name="link" placeholder="链接URL" class="form-control link-url"/><span class="J_delLink J_delete" lang="delete">删除</span></li>');
			translate()
			translateFun()
		});
		$(".J_editor_body").on('click','.J_delLink',function(){
			var $li=$(this).parent();
			if($li.siblings('li').length<=0){
				$(this).parents('.J_text').remove();
			}else{
				$li.remove();
			}
		});
	},
	addEmoji: function(obj) {
		//定位输入框
		$(obj).on('click', 'textarea', function() {
			$('.editor_focus').removeClass('editor_focus');
			$(this).addClass('editor_focus');
		});
		$('.code-html').on("click", '.J_emoji', function() {
			$(this).parents(".ui-sortable-handle").find(".form-control").focus();
			$(".emoji_container").css("display", "block")
		})
		$(document).emoji({
			showTab: true,
			button: '.J_emoji',
			animation: 'fade',
			icons: [{
				name: "",
				path: "http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/",
				maxNum: 91,
				excludeNums: [41, 45, 54],
				file: ".gif",
				placeholder: "[qq_{alias}]"
			}]
		});
	},
	addText: function() {
		var _self = this;
		$('.J_txtbtn').click(function() {
			_self.template({
				type: 'text'
			});
		})
	},
	addPic: function(opt) {
		var _self = this;
		if (_self.config.uploadUrl == "") {
			alert('请配置上传图片接口地址');
			return;
		}
		$('.J_uploadpic').click(function() {
			var $this = $(this),
				$form = $('<form enctype="multipart/form-data"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file"></form>');
			if ($this.hasClass('disabled')) {
				return;
			}
			$form.find(':file').unbind('change').one('change', function(ev) {
				let myForm = new FormData();
				let files = $form[0][0].files;
                for(let i = 0; i < files.length; i++){
                    myForm.append("file", files[i]);                
				}
				$this.addClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传中...');
				$.ajax({
					url: _self.config.uploadUrl + 'post/articleImg',
					type: 'post',
					data: myForm,
					contentType: false,
                    processData: false,
					success: function(data) {
						if(data.code=='10000'){
							_self.template({
								type: 'pic',
								url: data.path,
								filename: data.filename
							});
						}else{
							layer.msg(data.msg, {
								icon: 2
							});
						}
						_self.autoSave(opt)
						$this.removeClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传图片');
					},
					error: function(e) {
						$this.removeClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传图片');
						layer.msg('接口异常', {
							icon: 2
						});
					}
				})
			}).trigger('click');
		})
		translate()
	},
	addVideo: function() {
		var _self = this;
		$('.J_video').click(function() {
			$('.publish_page').append(_self.videoPromptTemplate())
			translateFun()
		})
	},
	addVideoState: function() {
		$('.publish_page').on('click', '.modal_tab_item', function(e) {
			e.preventDefault()
			e.stopPropagation()
			$(this).addClass('active')
			$(this).siblings().removeClass('active')
			$('.tab_pane').eq($(this).index()).addClass('sel');
			$('.tab_pane').eq($(this).index()).siblings().removeClass('sel');
			translate()
		})
	},
	addVideoUrl: function(opt) {
		var _self = this;
		$('.publish_page').on('click', '.madal_submit', function() {
			if ($(this).hasClass('madal_url_submit')) {
				_self.template({
					type: 'video',
					url: $('.video_url').val()
				});
				$('.modal_mask').remove()
				translate()
			} else {
				let videoFrom = new FormData("videoFrom");
				let files = $('.file_inp')[0].files;
				for(let i = 0; i < files.length; i++){
                    videoFrom.append("file", files[i]);                
				}
				$.ajax({
					url: _self.config.uploadUrl + 'post/articleVideo',
					type: 'post',
					data: videoFrom,
					contentType: false,
                    processData: false,
					success: function(data) {
						if(data.code=='10000'){
							_self.template({
								type: 'video',
								url: data.path,
								filename: data.filename
							});
							_self.autoSave(opt)
						} else {
							layer.msg(data.message, {
								icon: 2
							});
						}
						translate()
					},
					error: function(e) {
						layer.msg('接口异常', {
							icon: 2
						});
					}
				})
				$('.modal_mask').remove()
			}
		})
	},
	cancelVideo: function() {
		$('.publish_page').on('click', '.madal_cancel', function() {
			$('.modal_mask').remove()
		})
	},
	clearAll: function() {
		var _self = this;
		$('.J_clear').click(function() {
			let delUrlArr = []
			layer.confirm('确定要清空数据？', {
				btn: ['确定', '取消'] //按钮
			}, function(index) {
				for (let i = 0; i < _self.getData().length; i++) {
					if (_self.getData()[i].url && _self.getData()[i].url != '') {
						delUrlArr.push(_self.getData()[i].url)
						continue;
					}
				}
				_self.template({
					type: 'clear'
				});
				layer.close(index);
				if (delUrlArr.length < 1) return;
				let data = {
					urlArr: JSON.stringify(delUrlArr)
				}
				$.ajax({
					data: data,
					url: _self.config.uploadUrl + 'post/deleteUrl',
					type: 'post',
					success: function(res) {
						sessionStorage.removeItem('jStorage')
					},
					error: function(e) {
						layer.msg('接口异常', {
							icon: 2
						});
					}

				})
				
			}, function() {

			});
		})
	},
	clearOne: function() {
		var _self = this;
		$('.publish_page').on('click', '.madal_submit', function() {

		})
	},
	getData: function() {
		var data = [];
		$('.J_text').each(function(i, d) {
			var $this = $(d);
			switch ($this.data('type')) {
				case 'text':
					data.push({
						type: 'text',
						value: $this.find('textarea').val()
					});
					break;
				case 'pic':
					data.push({
						type: 'pic',
						url: $this.find('.pic').data('src'),
						value: $this.find('textarea').val(),
					});
					break;
				case 'video':
					data.push({
						type: 'video',
						url: $this.find('iframe').attr('src'),
						value: $this.find('textarea').val(),
					});
					break;
				case 'link':
					var urls=[];
					$(this).find('li').each(function(i,d){
						var _title=$(d).find('[name=title]').val(),_link=$(d).find('[name=link]').val();
						if(_title&&_link){
							urls.push({
								title:_title,
								link:_link,
							});
						}
					});
					if (urls.length) {
						data.push({
							type:'link',
							url:urls
						});
					}
				break;
			}
		});
		return data;
	}
}