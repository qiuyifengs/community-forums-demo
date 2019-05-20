
const articleType = this.location.pathname.split('/')[2] ? decodeURI(this.location.pathname.split('/')[2]) : 'ALL'
const refreshLoading = `<div class="ghost-loading-spinner">
                                <svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
                            </div>`
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

new SelfVue({
    el: '#app',
    data: {
        activity: JSON.parse(localStorage.getItem('activity')),
        userId: $.cookie('userId'),
        articleType: articleType,
        pageSize: 1,
        pullUpTxt: 'load more',
        refreshTxt: 'Refresh success',
        refreshText: refreshLoading,
        refreshEnd: false,
        
        config: {
            tSpeed: 300,
            bar: null,
            navSlideWidth: '',
            clientWidth: '',
            navSum: '',
            navWidth: '',
            topBar: '',
        },
        navSwiper: null,
        pageSwiper: null
    },
    mounted: function() {
        const self = this.methods
        // self.initTablist(this.articleType)
        // self.initHomePageRefresh()
        // self.initCarouselMap()
        // self.formatTimeChange()
        self.initNavSwiper(this, self)
        self.initPageSwiper(this, self)
        self.getArticleByType(this.articleType, this, self)
        
        self.scrollTo(this)
    },
    methods: {

        scrollTo: function (vm) {
            vm.navSwiper.slideTo(3, 1000, false)
            vm.pageSwiper.slideTo(3, 0)
        },

        initNavSwiper: function(vm, self) {

            vm.navSwiper = new Swiper('#secondary-nav', {
                slidesPerView: 'auto',
                freeMode: true,
                grabCursor: true,
                on: {
                    init: function() {
                        vm.config.navSlideWidth = this.slides.eq(0).css('width')
                        vm.config.bar = this.$el.find('.gm2-tabs-ink-bar')
                        vm.config.bar.css('width', vm.navSlideWidth)
                        vm.config.bar.transition(vm.tSpeed)
                        vm.config.navSum = this.slides[this.slides.length - 1].offsetLeft // 最后一个slide的位置
          
                        vm.config.clientWidth = parseInt(this.$wrapperEl.css('width')) // Nav的可视宽度
                        vm.config.navWidth = 0
                        for (i = 0; i < this.slides.length; i++) {
                            vm.config.navWidth += parseInt(this.slides.eq(i).css('width'))
                        }
          
                        vm.config.topBar = this.$el.parents('body').find('#container-top') //页头
                    }
                },
            })
          
            vm.navSwiper.$el.on('touchstart', function(e) {
                e.preventDefault()
            })

            vm.navSwiper.on('tap', function() {
                const clickIndex = this.clickedIndex
                const clickSlide = this.slides.eq(clickIndex)
                vm.pageSwiper.slideTo(clickIndex, 0)
                vm.config.bar.css('width', this.slides.eq(clickIndex).css('width'))
                this.slides.find('span').css('color', 'rgb(51, 51, 51)')
                clickSlide.find('span').css('color', '#485ec0')
                self.onTabClick()
            })
        },

        initPageSwiper: function(vm, self) {
            vm.pageSwiper = new Swiper('#page', {
                watchSlidesProgress: true,
                resistanceRatio: 0,
                on: {
                    touchMove: function() {
                        const progress = this.progress
                        vm.config.bar.transition(0)
                        vm.config.bar.transform('translateX(' + vm.config.navSum * progress + 'px)')
                    },
                    transitionStart: function() {
                        self.onTabClick()
                        const activeIndex = this.activeIndex
                        const activeSlidePosition = vm.navSwiper.slides[activeIndex].offsetLeft
                        vm.config.bar.css('width', vm.navSwiper.slides.eq(activeIndex).css('width'))
                        // 释放时导航 bar条移动过渡
                        vm.config.bar.transition(vm.config.tSpeed)
                        vm.config.bar.transform('translateX(' + activeSlidePosition + 'px)')
                        // 释放时文字变色过渡
                        vm.navSwiper.slides.eq(activeIndex).find('span').transition(vm.config.tSpeed)
                        vm.navSwiper.slides.eq(activeIndex).find('span').css('color', '#000')
                        // 导航居中
                        const navActiveSlideLeft = vm.navSwiper.slides[activeIndex].offsetLeft //activeSlide距左边的距离
          
                        vm.navSwiper.setTransition(vm.config.tSpeed)
                        if (navActiveSlideLeft < (vm.config.clientWidth - parseInt(vm.config.navSlideWidth)) / 2) {
                            vm.navSwiper.setTranslate(0)
                        } else if (navActiveSlideLeft > vm.config.navWidth - (parseInt(vm.config.navSlideWidth) + vm.config.clientWidth) / 2) {
                            vm.navSwiper.setTranslate(vm.config.clientWidth - vm.config.navWidth)
                        } else {
                            vm.navSwiper.setTranslate((vm.config.clientWidth - parseInt(vm.config.navSlideWidth)) / 2 - navActiveSlideLeft)
                        }
                    }
                }
            });
        },

        getArticleByType: function(articleType, vm, method) {
            let refreshEnd = false
            let swiper = new Swiper('.scroll',{
                speed: 300,
                slidesPerView: 'auto',
                freeMode: true,
                direction: 'vertical',
                setWrapperSize: true,
                scrollbar: {
                    el: '.swiper-scrollbar',
                },
                on:{
                    touchEnd: function(){
                        swiper = this
                        refreshText = swiper.$el.find('.gm-push-to-refresh-indicator')
                        if(this.translate > 50){
                            swiper.setTransition(this.params.speed);
                            swiper.setTranslate(50);
                            swiper.touchEventsData.isTouched=false;
                            refreshText.html(vm.refreshText)

                            
                            swiper.allowTouchMove = false;
                            swiper.removeAllSlides()
                            const url = articleType ? `topic/${ articleType }/${ vm.pageSize }` : `topic/ALL${ vm.pageSize }`
                            myAjax('GET', url).then(res => {
                                if (res.code === 10000 && res.articleList.length > 0) {
                                    $('.ghost-loading-mask').css('display', 'block')
                                    vm.pageSize++;
                                    let articleHtml = ''
                                    res.articleList.forEach(item => {
                                        articleHtml += method.renderArticleHtml(item, method)
                                    });
                                    swiper.appendSlide(articleHtml);
                                    
                                    $(".item-random-color").each(function() {
                                        const authorName = $(this).attr("article-author")
                                        $(this).css("background",renderColor(authorName))
                                    })
                                    
                                    refreshText.html('刷新完成');
                                    refreshEnd = true;
                                    swiper.allowTouchMove = true;
                                    
                                    $('.ghost-loading-mask').css('display', 'none')
                                }
                            })
                        } 
                    },
                    touchStart: function(){
                        if(refreshEnd==true){
                            this.$el.find('.gm-push-to-refresh-indicator').html('松开立即刷新');
                            refreshEnd = false;
                        }
                    },
                    
                    momentumBounce: function(){
                        swiper=this
                        //slidesheight=0;
                        //for(h=0;h<swiper.slides.length;h++){
                        //	slidesheight+=swiper.slides[h].offsetHeight;
                        //}
                        //endTranslate=this.height-slidesheight-20
                        //if(this.translate < endTranslate){}
                        if(swiper.translate <- 100){
                
                            swiper.allowTouchMove = false;
                            swiper.params.virtualTranslate = true;
                            // setTimeout(function(){
                            //     for(m=0;m<20;m++){
                            //         swiper.appendSlide('<div class="swiper-slide">moreSlide'+(times*20+m+1)+'</div>');	
                            //     }
                            //     swiper.params.virtualTranslate = false;
                            //     swiper.allowTouchMove= true;
                            //     times++
                            // },1000)

                            
                            
                        }
                    },
                }
            });
        },

        renderArticleHtml: (item, vm) => {
            return `<div class="gm-list-item gm-list-item-middle minHeight swiper-slide" article-id="${ item.articleId }">
                        <div class="gm-list-line am-list-line-multiple">
                            <div class="gm-list-content">
                                <a class="target-go" target="_blank" href="/post/articleDetail/${item.articleId}"
                                    <div class="gm-card">
                                        <div class="gm-card-header">
                                            <div class="gm-card-header-content">
                                                ${ vm.isTop(item.top) }
                                                <span class="gm-card-header-title fs18">
                                                    ${ item.articleTitle }
                                                </span>
                                            </div>
                                        </div>
                                        <div class="gm-card-body">
                                            <div class="gm-card-body-content">${ item.articleContent }</div>
                                            <div class="gm-card-body-extra">
                                                
                                            </div>
                                        </div>
                                        <div class="gm-card-footer">
                                            <span class="ghost-tag-list">
                                                <span class="ghost-tag ghost-tag-has-color ghost-tag-color-primary">${ item.articleType }</span>
                                            </span>
                                            <div class="gm-card-footer-meta">
                                                <div class="gm-card-footer-content">
                                                    <em class="format-time">${ item.publishTime }</em>
                                                </div>
                                                <div class="gm-card-footer-extra">
                                                    <span class="from-type">来自分类：${ item.articleType }</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>`
            },

        avatarColorChange: function() {
            $('.ghost-avatar-string').each(function() {
                const authorName = $(this).attr('article-author')
                $(this).parent().css('background', renderColor(authorName))
            })
        },

        formatTimeChange: function() {
            $('.format-time').each(function() {
                const resTime = formatDateFilter($(this).text())
                $(this).text(resTime)
            })
        },

        adjustTabPosition: function(tabId) {
            const viewportWidth = $('.gm-tabs-tab-bar-wrap').clientWidth
            const tabListWidth = $('.tablist').clientWidth
            const minTranslate = Math.min(0, viewportWidth - tabListWidth)
            const middleTranslate = viewportWidth / 2
            const items = $('.tablist').children('li')
            const navList = this.getNavList()
            let width = 0
            navList.every((item, index) => {
                if (item.id === tabId) {
                    return false
                }
                width +=  items[index].clientWidth
                return true
            })
            let translate = middleTranslate - width
            translate = Math.max(minTranslate, Math.min(0, translate))
        },

        getNavList: function() {
            let navList = []
            $('.tablist .gm2-tabs-tab').each(function(index) {
                navList.push({ id: index, name: $(this).text()})
            })
            return navList
        },
        onTabClick: function() {
            console.log(111)
            // $('.tablist li').on('click', function (e) {
            //     e.preventDefault()
            //     pageSize = 0
            //     $(this).addClass('gm-tabs-default-bar-tab-active')
            //     $(this).siblings().removeClass('gm-tabs-default-bar-tab-active')
            //     goPage(`topic/${$(this).text()}`)
            // })
        },

        onArticleClick: function() {
            // Click on the list item to enter the article details
            $('#artivleTemplate').on('click', '.ghost-list-item', function(event) {
                event.stopPropagation()
                const articleId = $(this).parents(".gohst-index-page").attr("article-id")
                myAjax("POST", "post/addView", { articleId: articleId, userId: $.cookie("userId") })
            })
        },

        showHeaderIcon: function(item) {
            if (item.hearderIcon != '' && item.hearderIcon != null) {
                return `<img src="/${ item.hearderIcon }">`
            } else {
                return `<span class="item-random-color" article-author="${item.author}">${item.author.substring(0, 1)}</span>`
            }
        },
        isTop: function(item) {
            if (item) {
                return `<span class="ghost-tag ghost-tag-has-color" style="background-color: var(--col-top)">置顶</span>`
            } else {
                return ''
            }
        },
        publishAnArticle: function() {
            $('.app-btn').on('click', function(e) {
                e.stopPropagation()
                if ($.cookie("userId")) {
                    if (activity) {
                        goPage('post/publish/')
                    } else {
                        if (confirm('该账户还未进行验证，请先进行验证！')) {
                            let url = 'account/account/' + nickName
                            goPage(url)
                        }
                    }
                } else {
                    goPage('user/login')
                }
            })
        },

        initHomePageRefresh: function() {
            new iScroll

            let minRefresh = new MiniRefresh({
                container: '#minirefresh',
                down: {
                    callback: function() {
                        console.log(1)
                        minRefresh.endDownLoading(true)
                    }
                },
                up: {
                    callback: function() {
                        console.log(2)
                        minRefresh.endUpLoading(true)
                    }
                }
            })
        },

        initSrollMenu: function() {
            new Swiper('.menuWrapper', {
                direction: 'vertical',
                slidesPerView: 'auto',
                freeMode: true,
                mousewheel: true,
              });
        },

        initCarouselMap: function() {
            new Swiper('.carouselMap', {
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            })
        },
        
        initTablist: function(articleType) {
            $('.tablist li').each(function(tagId) {
                if (articleType === $(this).text()) {
                    $(this).addClass('gm-tabs-default-bar-tab-active')
                    $(this).siblings().removeClass('gm-tabs-default-bar-tab-active')
                    // adjustTabPosition(tagId)
                    return false
                }
            })
        }
    }
})
    