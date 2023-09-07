(function () {
    var $;
    $ = this.jQuery || window.jQuery;
    win = $(window), body = $('body'), doc = $(document);

    $.fn.hc_accordion = function () {
        var acd = $(this);
        acd.find('ul>li').each(function (index, el) {
            if ($(el).find('ul li').length > 0) $(el).prepend('<button type="button" class="acd-drop"></button>');
        });
        acd.on('click', '.acd-drop', function (e) {
            e.preventDefault();
            var ul = $(this).nextAll("ul");
            if (ul.is(":hidden") === true) {
                ul.parent('li').parent('ul').children('li').children('ul').slideUp(180);
                ul.parent('li').parent('ul').children('li').children('.acd-drop').removeClass("active");
                $(this).addClass("active");
                ul.slideDown(180);
            } else {
                $(this).removeClass("active");
                ul.slideUp(180);
            }
        });
    }

    $.fn.hc_menu = function (options) {
        var settings = $.extend({
            open: '.open-mnav',
        }, options),
            this_ = $(this);
        var m_nav = $('<div class="m-nav"><button class="m-nav-close"><i class="fal fa-times"></i></button><div class="nav-ct"></div></div>');
        var m_nav_over = $('<div class="m-nav-over"></div>');
        body.append(m_nav);
        body.append(m_nav_over);

        m_nav.find('.m-nav-close').click(function (e) {
            e.preventDefault();
            mnav_close();
        });
        m_nav.find('.nav-ct').append($('.logo').clone());
        m_nav.find('.nav-ct').append(this_.children().clone());

        var mnav_open = function () {
            m_nav.addClass('active');
            m_nav_over.addClass('active');
            body.css('overflow', 'hidden');
        }
        var mnav_close = function () {
            m_nav.removeClass('active');
            m_nav_over.removeClass('active');
            body.css('overflow', '');
        }

        doc.on('click', settings.open, function (e) {
            e.preventDefault();
            if (win.width() <= 1199) mnav_open();
        }).on('click', '.m-nav-over', function (e) {
            e.preventDefault();
            mnav_close();
        });

        m_nav.hc_accordion();
    }

    $.fn.hc_countdown = function (options) {
        var settings = $.extend({
            date: new Date().getTime() + 1000 * 60 * 60 * 24,
        }, options),
            this_ = $(this);

        var countDownDate = new Date(settings.date).getTime();

        var count = setInterval(function () {
            var now = new Date().getTime();
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this_.html('<div class="item"><span>' + days + '</span> ngày</div>' +
                '<div class="item"><span>' + hours + '</span> giờ</div>' +
                '<div class="item"><span>' + minutes + '</span> phút </div>' +
                '<div class="item"><span>' + seconds + '</span> giây </div>'
            );
            if (distance < 0) {
                clearInterval(count);
            }
        }, 1000);
    }

    $.fn.hc_upload = function (options) {
        var settings = $.extend({
            multiple: false,
            result: '.hc-upload-pane',
        }, options),
            this_ = $(this);

        var input_name = this_.attr('name');
        this_.removeAttr('name');

        this_.change(function (e) {
            if ($(settings.result).length > 0) {
                var files = event.target.files;
                if (settings.multiple) {
                    for (var i = 0, files_len = files.length; i < files_len; i++) {
                        var path = URL.createObjectURL(files[i]);
                        var name = files[i].name;
                        var size = Math.round(files[i].size / 1024 / 1024 * 100) / 100;
                        var type = files[i].type.slice(files[i].type.indexOf('/') + 1);

                        var img = $('<img src="' + path + '">');
                        var input = $('<input type="hidden" name="' + input_name + '[]"' +
                            '" value="' + path +
                            '" data-name="' + name +
                            '" data-size="' + size +
                            '" data-type="' + type +
                            '" data-path="' + path +
                            '">');
                        var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img).append(input);
                        $(settings.result).append(elm);
                    }
                } else {
                    var path = URL.createObjectURL(files[0]);
                    var img = $('<img src="' + path + '">');
                    var elm = $('<div class="hc-upload"><button type="button" class="hc-del smooth">&times;</button></div>').append(img);
                    $(settings.result).html(elm);
                }
            }
        });

        body.on('click', '.hc-upload .hc-del', function (e) {
            e.preventDefault();
            this_.val('');
            $(this).closest('.hc-upload').remove();
        });
    }

}).call(this);


jQuery(function ($) {
    var win = $(window),
        body = $('body'),
        doc = $(document);

    var FU = {
        get_Ytid: function (url) {
            var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
            if (url) var arr = url.match(rx);
            if (arr) return arr[1];
        },
        get_currency: function (str) {
            if (str) return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        animate: function (elems) {
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function () {
                    $this.removeClass($animationType);
                });
            });
        },
    };

    var UI = {
        mMenu: function () {

        },
        header: function () {
            var elm = $('header'),
                h = elm.innerHeight(),
                offset = 200,
                mOffset = 0;
            var fixed = function () {
                elm.addClass('fixed');
                body.css('margin-top', h);
            }
            var unfixed = function () {
                elm.removeClass('fixed');
                body.css('margin-top', '');
            }
            var Mfixed = function () {
                elm.addClass('m-fixed');
                body.css('margin-top', h);
            }
            var unMfixed = function () {
                elm.removeClass('m-fixed');
                body.css('margin-top', '');
            }
            if (win.width() > 991) {
                win.scrollTop() > offset ? fixed() : unfixed();
            } else {
                win.scrollTop() > mOffset ? Mfixed() : unMfixed();
            }
            win.scroll(function (e) {
                if (win.width() > 991) {
                    win.scrollTop() > offset ? fixed() : unfixed();
                } else {
                    win.scrollTop() > mOffset ? Mfixed() : unMfixed();
                }
            });
        },
        backTop: function () {
            var back_top = $('.back-to-top'),
                offset = 800;

            back_top.click(function () {
                $("html, body").animate({ scrollTop: 0 }, 800);
                return false;
            });

            if (win.scrollTop() > offset) {
                back_top.fadeIn(200);
            }

            win.scroll(function () {
                if (win.scrollTop() > offset) back_top.fadeIn(200);
                else back_top.fadeOut(200);
            });
        },
        slider: function () {
            $('.cas-home').slick({
                autoplay: true,
                speed: 2000,
                autoplaySpeed: 5000,
                pauseOnHover: false,
                swipeToSlide: true,
                fade: true,
                nextArrow: '<i class="fal fa-angle-right smooth next"></i>',
                prevArrow: '<i class="fal fa-angle-left smooth prev"></i>',
                arrows: false,
                dots: false,
            })
            FU.animate($(".cas-home .slick-current [data-animation ^= 'animated']"));
            $('.cas-home').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                if (currentSlide != nextSlide) {
                    var aniElm = $(this).find('.slick-slide[data-slick-index="' + nextSlide + '"]').find("[data-animation ^= 'animated']");
                    FU.animate(aniElm);
                }
            });

            if ($('.cas-multi-concert').length) {
                $('.cas-multi-concert').slick({
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 2500,
                    swipeToSlide: false,
                    infinite: true,
                    // centerMode: true,
                    speed: 1000,
                    // variableWidth: true,
                    // responsive: [
                    //     {
                    //         breakpoint: 1599,
                    //         settings: {
                    //             slidesToShow: 6,
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 1199,
                    //         settings: {
                    //             slidesToShow: 5,
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 991,
                    //         settings: {
                    //             slidesToShow: 4,
                    //         }
                    //     },
                    //     {
                    //         breakpoint: 676,
                    //         settings: {
                    //             slidesToShow: 3,
                    //         }
                    //     }
                    // ],
                })
            }





            // $('.cas-home').owlCarousel({
            //     items: 1,
            //     loop: true,
            //     nav: false,
            //     dots: true,
            //     dotsClass: 'dots',
            //     autoplay: true,
            //     navClass: ["sl-arrow prev", "sl-arrow next"],
            //     navText: ["<i class='fal fa-long-arrow-left'></i>", "<i class='fal fa-long-arrow-right'></i>"],
            //     autoPlaySpeed: 8000,
            //     autoplayTimeout: 8000,
            //     smartSpeed: 800,
            //     onChanged: slider_change,
            // });
            // function slider_change(e) {
            //     var aniElm = $('.cas-home .owl-item').eq(e.item['index']).find("[data-animation ^= 'animated']");
            //     FU.animate(aniElm);
            // }
            // $('.cas-multi-concert').owlCarousel({
            //     loop: true,
            //     responsiveClass: true,
            //     nav: true,
            //     navClass: ["sl-arrow prev", "sl-arrow next"],
            //     navText: ["<i class='fal fa-chevron-left'></i>", "<i class='fal fa-chevron-right'></i>"],
            //     dots: false,
            //     smartSpeed: 500,
            //     margin: 30,
            //     autoplay: true,
            //     autoplayTimeout: 5000,
            //     responsive: {
            //         991: {
            //             items: 5,
            //         },
            //         479: {
            //             items: 4,
            //         },
            //         0: {
            //             items: 3,
            //         }
            //     }
            // });
        },
        input_number: function () {
            doc.on('keydown', '.numberic', function (event) {
                if (!(!event.shiftKey &&
                    !(event.keyCode < 48 || event.keyCode > 57) ||
                    !(event.keyCode < 96 || event.keyCode > 105) ||
                    event.keyCode == 46 ||
                    event.keyCode == 8 ||
                    event.keyCode == 190 ||
                    event.keyCode == 9 ||
                    event.keyCode == 116 ||
                    (event.keyCode >= 35 && event.keyCode <= 39)
                )) {
                    event.preventDefault();
                }
            });
            doc.on('click', '.i-number .up', function (e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var max = Number(input.attr('max')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(max) && input.attr('max').trim() != '') {
                        if (val >= max) {
                            return false;
                        }
                    }
                    input.val(val + 1);
                    input.trigger('number.up');
                }
            });
            doc.on('click', '.i-number .down', function (e) {
                e.preventDefault();
                var input = $(this).parents('.i-number').children('input');
                var min = Number(input.attr('min')),
                    val = Number(input.val());
                if (!isNaN(val)) {
                    if (!isNaN(min) && input.attr('max').trim() != '') {
                        if (val <= min) {
                            return false;
                        }
                    }
                    input.val(val - 1);
                    input.trigger('number.down');
                }
            });
        },
        yt_play: function () {
            doc.on('click', '.yt-box .play', function (e) {
                var id = FU.get_Ytid($(this).closest('.yt-box').attr('data-url'));
                $(this).closest('.yt-box iframe').remove();
                $(this).closest('.yt-box').append('<iframe src="https://www.youtube.com/embed/' + id + '?rel=0&amp;autoplay=1&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
            });
        },
        psy: function () {
            var btn = '.psy-btn',
                sec = $('.psy-section'),
                pane = '.psy-pane';
            doc.on('click', btn, function (e) {
                e.preventDefault();
                $(this).closest(pane).find(btn).removeClass('active');
                $(this).addClass('active');
                $("html, body").animate({ scrollTop: $($(this).attr('href')).offset().top - 40 }, 600);
            });

            var section_act = function () {
                sec.each(function (index, el) {
                    if (win.scrollTop() + (win.height() / 2) >= $(el).offset().top) {
                        var id = $(el).attr('id');
                        $(pane).find(btn).removeClass('active');
                        $(pane).find(btn + '[href="#' + id + '"]').addClass('active');
                    }
                });
            }
            section_act();
            win.scroll(function () {
                section_act();
            });
        },
        toggle: function () {
            var ani = 100;
            $('[data-show]').each(function (index, el) {
                var ct = $($(el).attr('data-show'));
                $(el).click(function (e) {
                    e.preventDefault();
                    ct.fadeToggle(ani);
                });
            });
            win.click(function (e) {
                $('[data-show]').each(function (index, el) {
                    var ct = $($(el).attr('data-show'));
                    if (ct.has(e.target).length == 0 && !ct.is(e.target) && $(el).has(e.target).length == 0 && !$(el).is(e.target)) {
                        ct.fadeOut(ani);
                    }
                });
            });
        },
        uiCounterup: function () {
            var item = $('.hc-couter'),
                flag = true;
            if (item.length > 0) {
                run(item);
                win.scroll(function () {
                    if (flag == true) {
                        run(item);
                    }
                });

                function run(item) {
                    if (win.scrollTop() + 70 < item.offset().top && item.offset().top + item.innerHeight() < win.scrollTop() + win.height()) {
                        count(item);
                        flag = false;
                    }
                }

                function count(item) {
                    item.each(function () {
                        var this_ = $(this);
                        var num = Number(this_.text().replace(".", ""));
                        var incre = num / 80;

                        function start(counter) {
                            if (counter <= num) {
                                setTimeout(function () {
                                    this_.text(FU.get_currency(Math.ceil(counter)));
                                    counter = counter + incre;
                                    start(counter);
                                }, 20);
                            } else {
                                this_.text(FU.get_currency(num));
                            }
                        }
                        start(0);
                    });
                }
            }
        },
        drop: function () {
            $('.drop').each(function () {
                var this_ = $(this);
                var label = this_.children('.label');
                var ct = this_.children('ul');
                var item = ct.children('li').children('a.drop-item');

                this_.click(function () {
                    ct.slideToggle(150);
                    label.toggleClass('active');

                });

                item.click(function (e) {
                    //e.preventDefault();
                    label.html($(this).html());
                });

                win.click(function (e) {
                    if (this_.has(e.target).length == 0 && !this_.is(e.target)) {
                        this_.children('ul').slideUp(150);
                        label.removeClass('active');
                    }
                })
            });
        },
        scrollHori: function (element) {
            const slider = document.querySelector(element);
            console.log(slider);
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.classList.add('active');
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('active');
            });
            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('active');
            });
            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 1; //scroll-fast
                slider.scrollLeft = scrollLeft - walk;
                //console.log(walk);
            });
        },
        ready: function () {
            //UI.mMenu();
            //UI.header();
            UI.slider();
            //UI.backTop();
            //UI.drop();
            //UI.toggle();
            //UI.input_number();
            //UI.uiCounterup();
            // UI.yt_play();
            // UI.psy();
            /*if($('.list-scroll').length){
                UI.scrollHori('.list-scroll');
            }*/
        },
    }


    UI.ready();


    /*custom here*/
    WOW.prototype.addBox = function (element) {
        this.boxes.push(element);
    };

    var wow = new WOW({
        mobile: false
    });
    wow.init();
    if ($(window).width() > 1199) {
        $('.wow').on('scrollSpy:exit', function () {
            $(this).css({
                'visibility': 'hidden',
                'animation-name': 'none'
            }).removeClass('animated');
            wow.addBox(this);
        }).scrollSpy();
    }
    $('.d-nav').hc_menu({
        open: '.open-mnav',
    })

    $(document).ready(function () {
        if (window.innerWidth <= 999) {
            $('.btn-drop').removeAttr('disabled');
        }
        // Ẩn tất cả các .el-group mặc định
        if (window.innerWidth <= 768) {
            $('footer .el-group').hide();
            $('.el > h1').click(function () {
                var elGroup = $(this).next('.el-group');

                if (elGroup.hasClass('active')) {
                    elGroup.slideUp();
                    elGroup.removeClass('active');
                } else {
                    $('.el-group').removeClass('active');
                    elGroup.slideDown();
                    elGroup.addClass('active');
                }
            });
        } else {
            $('footer .el-group').show();
        }
    });

    $(document).ready(function () {
        $('.ic-close').on('click', function(){
            $('.menu-ct').addClass('close-menu');
            $(body).css({'overflow':'auto'});
        });

        if (window.innerWidth >= 999) {
            $(".our-work").mouseenter(function () {
                $(".el-page-lg").addClass('on-our-work');
                $(".our-work").addClass('active');
            });
    
            $(".btn-drop").mouseenter(function () {
                $(".el-page-lg").removeClass('on-our-work');
                $(".our-work").removeClass('active');
                $('.menu-ct').removeClass('close-menu');
            });
    
            $(".our-team").mouseenter(function () {
                $(".el-page-lg").removeClass('on-our-work');
                $(".our-work").removeClass('active');
            });
    
            $(".contact-us").mouseenter(function () {
                $(".el-page-lg").removeClass('on-our-work');
                $(".our-work").removeClass('active');
            });
    
            $(".el-page-lg").mouseleave(function () {
                $(".el-page-lg").removeClass('on-our-work');
                $(".our-work").removeClass('active');
            });

            $(".menu-ct").mouseleave(function () {
                $(".el-page-lg").removeClass('on-our-work');
                $(".our-work").removeClass('active');
            });
        } else {
            $(".btn-drop").on('click',function () {
                $('.menu-ct').removeClass('close-menu');
                $(body).css({'overflow':'hidden'});
            });

            $(".our-work").on('click', function () {
                $(".el-category").hide();
                $(".el-page-sm").addClass('active-el-page');
            });

            $('.back-to-category').on('click', function () {
                $(".el-page-sm").removeClass('active-el-page');
                $(".el-category").show();
            })

            $('.contact-us').on('click', function(){
                $('.menu-ct').addClass('close-menu');
            });
        }
    });

    $(document).ready(function() {
        $('#service').click(function() {
            const targetOffset = $('#ct-concert').offset().top;
            const windowHeight = $(window).height();
            const scrollToPosition = targetOffset - (windowHeight / 4);
        
            $('html, body').animate({
              scrollTop: scrollToPosition
            }, 1000);
        
        });
    });

    $(document).ready(function() {
        $('#view-work').click(function() {
            const targetOffset = $('#ct-concert').offset().top;
            const windowHeight = $(window).height();
            const scrollToPosition = targetOffset - (windowHeight / 4);
        
            $('html, body').animate({
              scrollTop: scrollToPosition
            }, 1000);
        
        });
    });

    $(document).ready(function() {
        function showHeader() {
                $('.btn-let-chat').show();
                $('.logo').show();
                if ($(window).scrollTop() > 0) {
                    hideHeader();
                } else {
                    showHeader();
                }
        }

        if (window.innerWidth >= 999) {
            $('.menu-drop').on('mouseenter', function() {
                hideHeader();
            });
      
            $('.menu-drop').on('mouseleave', function() {
                showHeader();
            });
      
            // Focus
            $('#navbarSupportedContent').on('mouseenter', function() {
                hideHeader();
            });
      
            $('#navbarSupportedContent').on('mouseleave', function() {
                showHeader();
            });
        }

        function hideHeader() {
            $('.btn-let-chat').hide();
            $('.logo').hide();
        }
  
        // Hover

        const scrollMessage = $('.home-banner');
  
        $(window).on('scroll', function() {
          if ($(scrollMessage).scrollTop() > 0) {
            hideHeader();
          } else {
            showHeader();
          }
        });
      });

    $('.slider-for-trade-show').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        dotsClass: 'slider-dots',
        fade: true,
        asNavFor: '.slider-nav-trade-show'
    });

    $('.slider-nav-trade-show').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        asNavFor: '.slider-for-trade-show',
        infinite: true,
        dots: true,
        focusOnSelect: true,
        nextArrow: '<i class="fal fa-angle-right smooth next"></i>',
        prevArrow: '<i class="fal fa-angle-left smooth prev"></i>',
    });

    if ($('.cas-multi-client').length) {
        $('.cas-multi-client').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2500,
            swipeToSlide: true,
            infinite: true,
            speed: 1000,
            responsive: [
                {
                    breakpoint: 1599,
                    settings: {
                        slidesToShow: 5,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        slidesToShow: 4,
                    }
                },
            ],
        })
    }

    function destroySlider() {
        if ($('.cas-multi-client').hasClass('slick-initialized')) {
            $('.cas-multi-client').slick('unslick');
        }
    }

    function initSlider() {
        if (!$('.cas-multi-client').hasClass('slick-initialized')) {
            if ($('.cas-multi-client').length) {
                $('.cas-multi-client').slick({
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    dots: false,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 2500,
                    swipeToSlide: true,
                    infinite: true,
                    speed: 1000,
                    responsive: [
                        {
                            breakpoint: 1599,
                            settings: {
                                slidesToShow: 5,
                            }
                        },
                        {
                            breakpoint: 1199,
                            settings: {
                                slidesToShow: 4,
                            }
                        },
                    ],
                })
            }
        }
      }

    function checkWindowSize() {
        if ($(window).width() < 760) {
            destroySlider();
        } else {
            initSlider();
        }
    }

    function playVideo() {
        document.getElementById('video-home').addEventListener('loadedmetadata', function() {
            // Bắt đầu phát video sau khi metadata đã được tải xong
            document.getElementById('video-home').play();
        });
    }

    function checkWidth() {
        if ($(window).width() < 760) {
            // Attach click event to the document
            // document.getElementById('video-home').removeAttribute('autoplay');
            // document.getElementById('video-home').removeAttribute('playsinline');
            setTimeout(() => {
                document.getElementById('video-home').pause();
            }, 1500);
            

            $('#watch-video').on('click', function() {
                // Play the video
                document.getElementById('video-home').play();
                // Remove the click event to prevent multiple plays
                $(document).off('click');
            });
        } else {
            playVideo();
        }
    }

    // Gọi hàm kiểm tra kích thước màn hình lúc ban đầu
    checkWindowSize();
    checkWidth();

    // Theo dõi sự kiện thay đổi kích thước màn hình
    $(window).on('resize', function() {
        checkWindowSize();
        checkWidth();
    });

    $('.slider-for-pop-up').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        fade: true,
        asNavFor: '.slider-nav-pop-up'
    });

    
    $('.slider-nav-pop-up').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        asNavFor: '.slider-for-pop-up',
        infinite: true,
        dots: true,
        focusOnSelect: true,
        nextArrow: '<i class="fal fa-angle-right smooth next"></i>',
        prevArrow: '<i class="fal fa-angle-left smooth prev"></i>',
    });

    $('.slider-for-expo').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        fade: true,
        asNavFor: '.slider-nav-expo'
    });

    
    $('.slider-nav-expo').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        asNavFor: '.slider-for-expo',
        infinite: true,
        dots: true,
        focusOnSelect: true,
        nextArrow: '<i class="fal fa-angle-right smooth next"></i>',
        prevArrow: '<i class="fal fa-angle-left smooth prev"></i>',
    });
})