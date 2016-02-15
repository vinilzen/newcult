var gs, gf;
$(document).ready(function() {

    var sw = $('.site-wrapper'),
        swi = $('.site-wrapper-inner'),
        head = $('.masthead'),
        start_custom_scroll = false,
        activeSlide = 'first',
        timer, timer2;


    setTimeout( function(){
        $('.cover-container')
            .removeClass('showTitle')
            .addClass('showed');
    }, 2300 );

    $( ".cover-dark" ).scroll(function() {

        var id = $('.cover-active').attr('data-title'),
            title_id = '#title-' + id;

        if ( $('.cover-active').offset().top < -130 ){
            $('.title-slide').not(title_id).removeClass('fade');
            $(title_id).addClass('fade');
        } else {
            $('.title-slide').removeClass('fade');
        }

        if ($(this).offset().top == 0) {
            checkCurrentSubtitle();
        }

        if ($('#service').offset().top == 25) {
            // console.log("$('#service').offset().top == 25");
            goToFirstSlide();
        }
    });

    $('.item-project').hover(function(){
        if ( $(window).width() > 1023 ) {
            clearTimeout(timer);

            var img = $(this).attr('data-img');
            
            if (img){
                
                $('body').addClass('fadeout');
                timer2 = setTimeout(function(){
                    $('body').attr('class','');
                    $('body').addClass('body-project-'+img);
                    $('.cover-dark').css({'background': 'none'})
                }, 400);
            }
        }
    }, function(){
        if ( $(window).width() > 1023 ) {
            clearTimeout(timer2);

            $('body').addClass('fadeout');
            timer = setTimeout(function(){
                $('body').attr('class','');
                $('.cover-dark').css({'background-color': '#191919'});
            }, 400);
        }
    });

    $('.icon-arrow-down').click(function(){
        // if (!start_custom_scroll)
        goToSecondSlide();
        return false;
    });

    $('#home').click(function(){ 
        // $('html,body').animate({ scrollTop: 0 }, 'slow');
        goToFirstSlide();
        return false;
    });

    $('.masthead-nav a[href^="#"]').click(function(e) {
        var $el = $(this),
            target = $el.attr('href');

        $('.masthead-nav li').removeClass('active');
        $el.closest('li').addClass('active');

        if (target.length) {
            e.preventDefault();

            if (!start_custom_scroll && activeSlide == 'first') {
                goToSecondSlide();
            }

            $('.cover-dark').animate({
                scrollTop: $(target).position().top
            }, 1000, function() {
                checkCurrentSubtitle();
            });
        }
        return false;
    });

    $('body').on('mousewheel DOMMouseScroll', function(e) {

        // console.log('mousewheel');

        var e0 = window.event || e,
            delta = Math.max(-1, Math.min(1, (e0.wheelDelta || -e0.detail)));

        if (!start_custom_scroll && delta === -1) {
            goToSecondSlide();
        }

        if (!start_custom_scroll && $('#service').offset().top == 25 && delta === 1) {
            goToFirstSlide();
        }
    });

    function goToSecondSlide() {
        // console.log('goToSecondSlide');
        start_custom_scroll = true;
        head.addClass('text-white');
        swi.animate({
            top: -$('.cover-first').outerHeight()
        }, 600, 'swing', function() {
            checkCurrentSubtitle();
            activeSlide = 'second';
            setTimeout(start_custom_scroll = false, 1000);
            $('.cover-dark').addClass('active-cover');
            $('.cover-first').removeClass('active-cover');
        });
    }

    function goToFirstSlide() {
        // console.log('goToFirstSlide');
        $('.cover-dark').addClass('goToFirstSlide');
        start_custom_scroll = true;
        head.removeClass('text-white');
        $('.title-slide').removeClass('active');
        swi.animate({
            top: 0
        }, 800, 'swing', function() {
            setTimeout(start_custom_scroll = false, 1000);
            activeSlide = 'first';
            $('.cover-dark').removeClass('active-cover');
            $('.cover-dark').removeClass('goToFirstSlide');
            $('.cover-first').addClass('active-cover');
        });
    }

    function checkCurrentSubtitle() {
        // console.log('checkCurrentSubtitle');
        $('.slide').each(function() {

            var height = $(this).outerHeight(),
                offset_top = $(this).offset().top;

            if (offset_top > -height && offset_top < 250) {
                var id = $(this).attr('data-title'),
                    title_id = '#title-' + id,
                    li_id = '#li-' + id;

                if (id == 'contact') {
                    $('.cover-dark.cover .footer').addClass('in');
                } else {
                    $('.cover-dark.cover .footer').removeClass('in');
                }

                $('.title-slide').not(title_id).removeClass('active');
                $(title_id).addClass('active');

                $('.slide').removeClass('cover-active');
                $('#'+id).addClass('cover-active');

                $('.masthead-nav li').removeClass('active');
                $(li_id).addClass('active');
            }
        });
    }
});
