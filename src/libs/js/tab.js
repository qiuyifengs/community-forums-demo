$(document).ready(function () { 
    let activePos = $('.ghost-tabs-nav .ghost-tabs-tab-active').position()
    function changePos() {
        activePos = $('.ghost-tabs-nav .ghost-tabs-tab-active').position()
        $('.ghost-tabs-ink-bar').stop().css({
            left: activePos.left,
            width: $('.ghost-tabs-nav .ghost-tabs-tab-active').width()
        })
    }
    changePos()

    let tabHeight = $('.ghost-tabs-tabpane .ghost-tabs-tabpane-active').height()

    function animateTabHeight() {
        tabHeight = $('.ghost-tabs-tabpane .ghost-tabs-tabpane-active').height()
        $('.ghost-tabs-content').stop().css({ height: tabHeight + 'px' })
    }
    animateTabHeight()

    function changeTab() {
        const getTabId = $('.ghost-tabs-nav .ghost-tabs-tab-active a').attr('tab-id')
        $('.ghost-tabs-tabpane').stop().fadeOut(300, function () {
            $(this).removeClass('ghost-tabs-tabpane-active')
        }).hide();
        $('.ghost-tabs-tabpane[tab-id=' + getTabId + ']').stop().fadeIn(300, function () {
            $(this).addClass('ghost-tabs-tabpane-active')
            animateTabHeight()
        });
    }

    $('.ghost-tabs-nav .ghost-tabs-tab a').on('click', function (e) {
        e.preventDefault()
        const tabId = $(this).attr('tab-id')
        $('.ghost-tabs-nav .ghost-tabs-tab a').stop().parent().removeClass('ghost-tabs-tab-active')
        $(this).stop().parent().addClass('ghost-tabs-tab-active')
        changePos()
        tabCurrentItem = tabItems.filter('.ghost-tabs-tab-active')
        $('.ghost-tabs-tabpane').stop().fadeOut(300, function () {
            $(this).removeClass('ghost-tabs-tabpane-active')
        }).hide()
        $('.ghost-tabs-tabpane[tab-id="' + tabId + '"]').stop().fadeIn(300, function () {
            $(this).addClass('ghost-tabs-tabpane-active')
            animateTabHeight()
        })
    })

    let tabItems = $('.ghost-tabs-nav .ghost-tabs-tab')
    let tabCurrentItem = tabItems.filter('.ghost-tabs-tab-active')
    /*$('#next').on('click', function (e) {
        e.preventDefault()
        let nextItem = tabCurrentItem.next()
        tabCurrentItem.removeClass('ghost-tabs-tab-active')
        if (nextItem.length) {
            tabCurrentItem = nextItem.addClass('ghost-tabs-tab-active')
        } else {
            tabCurrentItem = tabItems.first().addClass('ghost-tabs-tab-active')
        }
        changePos()
        changeTab()
    })
    $('#prev').on('click', function (e) {
        e.preventDefault()
        let prevItem = tabCurrentItem.prev()
        tabCurrentItem.removeClass('ghost-tabs-tab-active')
        if (prevItem.length) {
            tabCurrentItem = prevItem.addClass('ghost-tabs-tab-active')
        } else {
            tabCurrentItem = tabItems.last().addClass('ghost-tabs-tab-active')
        }
        changePos()
        changeTab()
    });*/
})