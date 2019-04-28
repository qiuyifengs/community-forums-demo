const slideout = new Slideout({
    'panel': document.getElementById('main'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
});

document.querySelector('.js-slideout-toggle').addEventListener('click', function() {
    slideout.toggle();
});

document.querySelector('.menu').addEventListener('click', function(eve) {
    if (eve.target.nodeName === 'A') { slideout.close(); }
});
function aload(t){"use strict";t=t||window.document.querySelectorAll("[data-aload]"),void 0===t.length&&(t=[t]);var a,e=0,r=t.length;for(e;r>e;e+=1)a=t[e],a["LINK"!==a.tagName?"src":"href"]=a.getAttribute("data-aload"),a.removeAttribute("data-aload");return t}
    window.onload = function(){
    aload();
}


jQuery(document).ready(function($) {

    
    // new IScroll('#menuWrapper', { 
    //     scrollbars:true,//显示滚动条（默认是false不显示）
    //     mouseWheel:true,//支持鼠标触发区域滚动
    //     interactiveScrollbars: true
    // });


    var mainHeader = $('.auto-hide-header'),
    secondaryNavigation = $('.secondary-nav'),
    belowNavHeroContent = $('.sub-nav-hero'),
    headerHeight = mainHeader.height();
    var scrolling = false,
    previousTop = 0,
    currentTop = 0,
    scrollDelta = 10,
    scrollOffset = 150;
    mainHeader.on('click', '.nav-trigger',
    function(event) {
        event.preventDefault();
        mainHeader.toggleClass('nav-open');
    });
    $(window).on('scroll',
    function() {
        if (!scrolling) {
            scrolling = true; 
            (!window.requestAnimationFrame) ? setTimeout(autoHideHeader, 250) : 
            requestAnimationFrame(autoHideHeader);
        }
    });
    $(window).on('resize',
    function() {
        headerHeight = mainHeader.height();
    });
    function autoHideHeader() {
        var currentTop = $(window).scrollTop(); (belowNavHeroContent.length > 0) ? 
        checkStickyNavigation(currentTop) : checkSimpleNavigation(currentTop);
        previousTop = currentTop;
        scrolling = false;
    }
    function checkSimpleNavigation(currentTop) {
        if (previousTop - currentTop > scrollDelta) {
            mainHeader.removeClass('is-hidden');
        } else if (currentTop - previousTop > scrollDelta && 
            currentTop > scrollOffset) {
            mainHeader.addClass('is-hidden');
        }
    }
    function checkStickyNavigation(currentTop) {
        var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height()
         - mainHeader.height();
        if (previousTop >= currentTop) {
            if (currentTop < secondaryNavOffsetTop) {
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('fixed slide-up');
                belowNavHeroContent.removeClass('secondary-nav-fixed');
            } else if (previousTop - currentTop > scrollDelta) {
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.removeClass('slide-up').addClass('fixed');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }
        } else {
            if (currentTop > secondaryNavOffsetTop + scrollOffset) {
                mainHeader.addClass('is-hidden');
                secondaryNavigation.addClass('fixed slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            } else if (currentTop > secondaryNavOffsetTop) {
                mainHeader.removeClass('is-hidden');
                secondaryNavigation.addClass('fixed').removeClass('slide-up');
                belowNavHeroContent.addClass('secondary-nav-fixed');
            }
        }
    }
});

(function(exports) {
    exports.parseHtml = function(strHtml) {
        return ''
    };
}(window.common = {}))
