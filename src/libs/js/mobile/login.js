
new SelfVue({
    el: '#app',
    data: {
        param: {
            userId: $('#email').val(),
            passWord: $('#password').val(),
        },
        dialog: window.ghostUi.dialog
    },
    mounted: function() {
        // $.validator.setDefaults({
        //     debug: true, // 调试模式设为true 只验证不提交form 
        //     submitHandler: function (form) {
        //         loginFormSubmitHandler()
        //     }
        // })
        $('input[type=password]').iPass()
    },
    methods: {
        loginFormSubmitHandler: function() {
            myAjax('POST', 'user/login', param).then(res => {
                layer.msg(res.message);
                beforeSend: (xhr) => {
                         xhr.setRequestHeader("Authorization", "Basic " + token ); 
                    }
                if (res.code === 10006) {
                    $.cookie('nickName', res.data.nickName, { expires:7, path: '/' });
                    $.cookie('userId', res.data.userId, { expires: 7, path: '/' })
                    setTimeout(function () {
                        goPage('');
                    }, 500);
                } else {
                    console.log('请求失败！')
        
                }
            })
        },

        loginSubmit: function() {
            // this.dialog.notify('2秒后自动消失，点我也可以消失', 2000, function() {
            //     console.log('我走咯')
            // });
            const param = {
                "type": 1,
                "versionNumber": "370",
                "lang": "zh_CN"
            }
            $.ajax({
                type: 'POST',
                url: 'http://192.168.4.16:4000/api/version/selectVersion',
                dataType:'json',
                data: JSON.stringify(param),
                success: (res) => {
                    if (res.data && res.data.downloadPath) {
                        window.open(res.data.downloadPath)
                    }
                },
                error: (err) => {
                    console.log(err)
                }
            })

            // this.dialog.alert('2秒后自动消失，点我也可以消失');
            // const self = this

            // self.dialog.confirm('自定义按钮', '我有一个小猫撸', [
            //     {
            //         txt: '取消',
            //         color: false,
            //         callback: function() {
                        
            //             self.dialog.notify('点击了取消', 2000)
            //         }
            //     },
            //     {
            //         txt: '确定',
            //         color: true,
            //         callback: function() {
            //             self.dialog.notify('点击了确定', 2000)
            //         }
            //     }
            // ])
        },

        loginFormValidate: function() {
            $("#loginForm").validate({
                onfocusin: function (element) { $(element).valid() },
                onfocusout: function (element) { $(element).valid() },
                onkeyup: function (element) { $(element).valid() },
                focusInvalid: function (element) {
                    $(element).valid()
                },
                errorElement: 'div',
                errorClass: "ghost-form-explain",
                highlight: function (element, errorClass, validClass) {
                    const elementId = $(`#${element.id}-error`)
                    // $(elementId).parents().addClass('ghost-form-item-with-help')
                    $(elementId).addClass("ghost-form-explain")
                    $(elementId).parent().addClass('has-error')
                },
                unhighlight: function (element, errorClass) {
                    const elementId = $(`#${element.id}-error`)
                    $(elementId).parent().removeClass('has-error').addClass('has-success')
                    $(elementId).parents().removeClass('ghost-form-item-with-help')
                },
                rules: {
                    password: {
                        required: true,
                        minlength: 6
                    },
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    password: {
                        required: "请输入密码",
                        minlength: "密码长度不能小于 6 位数"
                    },
                    email: "请输入一个正确的邮箱"
                }
            });
        },

        enterRegisterPage: function() {
            goPage('user/register')
        },

        enterLosePassword: function() {
            goPage("account/losePassword")
        }
    }
})
/**
 * Generic constructor for all components
 * @constructor
 * @param {Element} el
 * @param {Object} options
 * @class Component
 */
class Component {
    constructor(classDef, el, options) {
        if (!(el instanceof Element)) {
            console.error(el + ' is not an HTML Element')
        }

        let ins = classDef.getInstance(el);
        if (!!ins) {
            ins.destroy()
        }

        this.el = el;
        this.$el = cash(el)
    }

    /**
     * Initializes components
     * @param {class} classDef
     * @param {Element | NodeList | jQuery} els
     * @param {Object} options
     */

    static init(classDef, els, options) {
        let instances = null;
        if (els instanceof Element) {
            instances = new classDef(els, options)
        } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
            let instancesArr = []
            for(let i = 0; i < els.length; i++) {
                instancesArr.push(new classDef(els[i], options))
            }
            instances = instancesArr
        }
        return instances
    }
}

(function($, anim) {
    'use strict';

    let _default = {
        exitDelay: 200,
        enterDelay: 0,
        html: null,
        margin: 5,
        inDuration: 200,
        outDuration: 200,
        position: 'bottom',
        transitionMovement: 10
    };

    /**
     *
     *
     * @class Tooltip
     * @extends {Component}
     */
    class Tooltip extends Component {
        /**
         *Creates an instance of Tooltip.
         * @param {Element} el
         * @param {Object} options
         * @memberof Tooltip
         */
        constructor(el, options) {
            super.init(Tooltip, els, options)
            this.el.M_Tooltip = this
            this.options = $.extend({}, Tooltip.default, options)
            this.isOpen = false
            this.isHovered = false
            this.isFocused = false
            this._appendTooltipEl()
            this._setupEventHandlers()
        }

        static get defaults() {
            return _defaults
        }

        static init() {
            return super.init(this, els, options)
        }

        static getInstance(el) {
            let domElem = !!el.jQuery ? el[0] : el
            return domElem.M_Tooltip
        }

        _appendTooltipEl() {
            let tooltipEl = document.createElement('div')
            tooltipEl.classList.add('material-tooltip')
            this.Tooltip = tooltipEl

            let tooltipContentEl = document.createElement('div')
            tooltipContentEl.classList.add('tooltip-content')
            tooltipContentEl.innerHTML = this.options.html
            tooltipEl.appendChild(tooltipContentEl)
            document.body.appendChild(tooltipEl)
        }

        _updateTooltipContent() {
            this.tooltipEl.querySelector('Tooltip-content').innerHTML = this.options.html
        }

        _setupEventHandlers() {
            this._handleMouseEnterBound = this._handleMouseEnter.bind(this)
            this._handleMouseLeaveBound = this._handleMouseLeave.bind(this)
            this._handleFocusBound = this._handleFocus.bind(this)
            this._handleBlurBound = this._handleBlur.bind(this)

            this.el.addEventListener('mouseenter', this._handleMouseEnterBound)
            this.el.addEventListener('mouseleave', this._handleMouseLeaveBound)
            this.el.addEventListener('focus', this._handleFocus, true)
            this.el.addEventListener('blur', this._handleBlur, true)
        }

        _removeEventHandlers() {
            this.el.removeEventListener('mouseenter', this._handleMouseEnterBound)
            this.el.removeEventListener('mouseleave', this._handleMouseLeaveBound)
            this.el.removeEventListener('focus', this._handleBlurBound)
            this.el.removeEventListener('blur', this._handleBlurBound)
        }

        open(isManual) {

        }

        close() {

        }

        _setExitDelayTimeout() {

        }

        _setEnterDelayTimeout() {

        }

        _positionTooltip() {

        }

        _repositionWithinScreen(x, y, width, height) {

        }

        _animateIn() {

        }

        _animateOut() {

        }

        _handleMouseEnter() {
            this.isHovered = true
            this.isFocused = false // Allow close of tooltip when opened by focus
            this.open()
        }

        _handleMouseLeave() {
            this.isHovered = false
            this.isFocused = false
            this.close()
        }

        _handleFocus() {

        }

        _handleBlur() {

        }

        _getAttributeOption() {

        }


    }
})