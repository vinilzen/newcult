var gs, gf, project_active = false;
$(document).ready(function() {

    var colors = new Array(
      [62,35,255],
      [60,255,60],
      [255,35,98],
      [45,175,230],
      [255,0,255],
      [255,128,0]);

    var step = 0;
    //color table indices for: 
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0,1,2,3];

    //transition speed
    var gradientSpeed = 0.001;

    function updateGradient() {
      
        if ( $===undefined ) return;
      
        var c0_0 = colors[colorIndices[0]],
            c0_1 = colors[colorIndices[1]],
            c1_0 = colors[colorIndices[2]],
            c1_1 = colors[colorIndices[3]];

        var istep = 1 - step;

        var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]),
            g1 = Math.round(istep * c0_0[1] + step * c0_1[1]),
            b1 = Math.round(istep * c0_0[2] + step * c0_1[2]),
            color1 = "rgb("+r1+","+g1+","+b1+")";

        var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]),
            g2 = Math.round(istep * c1_0[1] + step * c1_1[1]),
            b2 = Math.round(istep * c1_0[2] + step * c1_1[2]),
            color2 = "rgb("+r2+","+g2+","+b2+")";

        $('#first').css({
            background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
            background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"
        });
      
        step += gradientSpeed;
        
        if ( step >= 1 ) {
            step %= 1;
            colorIndices[0] = colorIndices[1];
            colorIndices[2] = colorIndices[3];
            
            //pick two new target color indices
            //do not pick the same as the current one
            colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        }
    }

    setInterval(updateGradient,10);


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

    if ( $(window).width() > 767 ){

        $('body').on('mousewheel DOMMouseScroll', function(e) {

            var e0 = window.event || e,
                delta = Math.max(-1, Math.min(1, (e0.wheelDelta || -e0.detail)));

            if (!start_custom_scroll && delta === -1) {
                goToSecondSlide();
            }

            if (!start_custom_scroll && $('#service').offset().top == 25 && delta === 1) {
                goToFirstSlide();
            }

            if ($('.cover-first').offset().top == 0) {
                $('.masthead-nav li').removeClass('active');
            }
        });

        $('.icon-arrow-down').click(function(){
            goToSecondSlide();
            return false;
        });

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
    }

    var x = 0,
        y = 0;

    $('.item-project').hover(hoverIn, hoverOut);

    $('.arrow_link_abc').click(function(){
        $("html, body").animate({
            scrollTop: $('#first').outerHeight()
        }, 800);
    });

    $('#home-link').click(function(){
        
        $('.masthead-nav li').removeClass('active');

        if ($(window).width() > 767) {
            goToFirstSlide();
        } else {
            if ( $('body').hasClass('modal-open') ){
                $('#navbar').collapse('toggle');
            }
            $("html, body").animate({ scrollTop: 0 });
        }
        return false;
    });

    $('#navbar').on('show.bs.collapse', function () {
        $('body').addClass('modal-open');
    }).on('hide.bs.collapse', function () {
        $('body').removeClass('modal-open');
    });

    $('#home-link, .navbar-toggle').affix({
      offset: {
        top: $('#first').outerHeight(),
      }
    });

    $('.masthead-nav a[href^="#"]').click(function(e) {

        var $el = $(this),
            target = $el.attr('href');

        $('.masthead-nav li').removeClass('active');
        $el.closest('li').addClass('active');

        if ($(window).width() > 767) {

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

        } else {
            
            $('#navbar').collapse('toggle');

            $('body').animate({
                scrollTop: $(target).position().top+$(window).height()
            }, 1000, function(){
                // $('#navbar').collapse('toggle');
            });
        }
    });

    $('#myModal').on('show.bs.modal', function (e) {
        $('.navbar-toggle.collapsed.affix').fadeOut();
    }).on('hide.bs.modal', function (e) {
        $('.navbar-toggle.collapsed.affix').fadeIn();
    })

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
        $('.cover-dark').addClass('goToFirstSlide');
        start_custom_scroll = true;
        head.removeClass('text-white');
        $('.title-slide').removeClass('active');

        $('.masthead-nav li').removeClass('active');
        swi.animate({
            top: 0
        }, 800, 'swing', function() {
            setTimeout(start_custom_scroll = false, 1000);
            activeSlide = 'first';
            $('.cover-dark').removeClass('active-cover');
            $('.cover-dark').removeClass('goToFirstSlide');
            $('.cover-first').addClass('active-cover');
            hoverOut();
            project_active = false;
        });
    }

    function checkCurrentSubtitle() {
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
                $(title_id).addClass('active').attr('style','');

                $('.slide').removeClass('cover-active');
                $('#'+id).addClass('cover-active');
                
                if (id == 'project'){
                    setTimeout(function(){
                        project_active = true;
                        if ( !$('body').hasClass('body-project-universal') ){
                            hoverIn.call($('.item-project.item-hover'));
                        } else {
                            if ($('.item-project.item-hover').length == 0) {
                                $(title_id).removeClass('transparent');
                                hoverOut(false)
                            }
                        }
                    }, 900);
                } else {
                    project_active = false;
                    hoverOut();
                }

                $('.masthead-nav li').removeClass('active');
                $(li_id).addClass('active');
            }
        });
    }

    function hoverIn () {
        $(this).addClass('item-hover');
        if ( $(window).width() > 1023 && project_active ) {

            clearTimeout(timer);

            var img = $(this).attr('data-img');
            
            if (img){
                
                $('body').addClass('fadeout');

                $('.title-slide.active').addClass('transparent');

                timer2 = setTimeout(function(){
                    $('body').attr('class','');
                    $('.after').css({'background-image': 'url(img/_'+img+'.jpg'});
                    $('body').addClass('body-project-universal');
                    $('.cover-dark').css({'background': 'none'})
                }, 200);
            }
        }
    }

    function hoverOut (save) {
        var save = save || true
        if (save) {
            $(this).removeClass('item-hover');
        }
        if ( $(window).width() > 1023 && project_active ) {
            
            clearTimeout(timer2);

            $('body').addClass('fadeout');
            timer = setTimeout(function(){
                $('.title-slide.active').removeClass('transparent');
                $('body').attr('class','');
                $('.after').css({'background-image': 'none'});
                $('.cover-dark').css({'background-color': '#191919'});
            }, 200);
        }
    }
});
