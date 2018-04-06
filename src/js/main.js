;(function ($) {
  'use strict';

  $.fn.convertSVGsToInline = function () {
    function getSVG (img, callback) {
      $.ajax({
        url: img.attr('src'),
        dataType: 'text',
        success: function (data) {
          callback(data, img);
        },
        error: function (err) {
          console.error(err, img);
        }
      });

    }

    function parseSVG (rawSVG, originalImg) {
      var $svg = $(rawSVG),
          svgId = originalImg.attr('id'),
          svgClass = originalImg.attr('class'),
          svgAlt = originalImg.attr('alt');

      // remove emdedded styles if they exist
      $svg.find('style').remove();

      // remove any ids embedded in SVG to prevent duplicates for 508
      $svg.removeAttr('id').removeAttr('style', '');

      if (svgId) {
        if ($(svgId).length === 0) {
          $svg.attr('id', svgId);
        }
      }

      if (svgClass) {
        $svg.attr('class', svgClass);
      }

      if (svgAlt) {
        $svg.prepend('<title>' + svgAlt + '</title>');
      }

      originalImg.replaceWith($svg);
    }

    this.each(function () {
      getSVG($(this), parseSVG);
    });

    return this;
  };

  var isMobile = false,
      ieVer;


  function viewport() {
    var e = window,
        a = 'inner';

    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }

    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    };
  }

  function MobileCheck() {
    if (viewport().width < 992) {
      isMobile = true;
    } else {
      isMobile = false;
    }
  }

  function getInternetExplorerVersion()
  // Returns the version of Internet Explorer or -1 (indicating the use of another browser).
  {
    var rv = -1,
        ua,
        re;

    if (navigator.appName === 'Microsoft Internet Explorer') {
      ua = navigator.userAgent;
      re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) !== null) {
        rv = parseFloat(RegExp.$1);
      }
    }

    return rv;
  }

  ieVer = getInternetExplorerVersion();


  function parallaxInit() {
    var parallax = $('.parallax'),
        speed = 0.2;

    function parallaxScroll() {
      if (!isMobile) {
        [].slice.call(parallax).forEach(function (el, i) {
          var windowYOffset = window.pageYOffset - el.offsetTop - 50,
              elBackgrounPos = 'center ' + (windowYOffset * speed) + 'px';

          el.style.backgroundPosition = elBackgrounPos;
        });
      } else {
        [].slice.call(parallax).forEach(function (el, i) {
          el.style.backgroundPosition = 'center 0';
        });
      }
    }

    window.onscroll = function () {
      parallaxScroll();
    };

    parallaxScroll();

  } // END parallaxInit();

  function buildNavigation() {
    var navLevel = 0;

    $('.navbar-toggle').click(function () {
      if (isMobile) {
        $(this).mobileNavHeight();
      }
    });

    $('.navbar .navbar-nav li').not('.navbar.footer .navbar-nav li').hover(function () {
      if (!isMobile) {
        var ul = $(this).children('ul'),
            ulHeight = 0;

        ul.children('li').not('.sub-nav, .sub-nav-back').each(function () {
          ulHeight += $(this).height();
        });
        ul.height(ulHeight);
      }
    },
                                                                           function () {
      if (!isMobile) {
        var ul = $(this).children('ul');

        ul.height('');
      }
    });

    $('.navbar ul.navbar-nav li').not('.navbar.footer ul.navbar-nav li').each(function () {
      if ($(this).children('ul').length !== 0) {
        $(this).children('a').append('<span class="sub-nav"><img src="/SiteAssets/images/arrow-right.svg" alt="arrow right"></span>');
        $(this).children('ul').prepend('<li class="sub-nav-back"><img src="/SiteAssets/images/arrow-left.svg" alt="arrow left"> Back</span>');
      }
    });

    $('.navbar ul.navbar-nav .sub-nav').not('.navbar.footer ul.navbar-nav .sub-nav').click(function (event) {
      event.stopPropagation();
      event.preventDefault();
      var t = $(this);

      navLevel++;
      $(this).closest('li').siblings('li').find('ul').css('display', 'none');
      $(this).closest('li').children('ul').css('display', 'block');
      $('ul.navbar-nav').css('left', '-' + navLevel + '00%');
      if (isMobile) {
        setTimeout(function () {
          t.mobileNavHeight();
        }, 1);
      }
    });

    $('.navbar ul.navbar-nav .sub-nav-back').not('.navbar.footer ul.navbar-nav .sub-nav-back').click(function (event) {
      event.stopPropagation();
      event.preventDefault();
      navLevel--;
      if (navLevel <= 0) {
        navLevel = 0;
        $('ul.navbar-nav').css('left', '0');
      } else {
        $('ul.navbar-nav').css('left', '-' + navLevel + '00%');
      }

      if (isMobile) {
        $(this).mobileNavHeight();
      }
    });

    $('.navbar ul.navbar-nav > li > ul > li > a').on('focusin', function () {
      var ul = $(this).closest('ul'),
          ulHeight = 0;

      ul.parent('li').addClass('open');
      if (!isMobile) {
        ul.children('li').not('.sub-nav, .sub-nav-back').each(function () {
          ulHeight += $(this).height();
        });
        ul.height(ulHeight);
      }
    });

    $('.navbar ul.navbar-nav > li > ul > li > a').on('focusout', function () {
      var ul = $(this).closest('ul');

      ul.parent('li').removeClass('open');
      if (!isMobile) {
        ul.height('');
      }
    });

  }

  function breakURLS() {
    $('a').each(function () {
      var text = $(this).text();

      if (text.indexOf('http') === 0 || (text.indexOf(' ') === -1 && text.length >= 20)) {
        $(this).css('word-break', 'break-all');
      }
    });
  }

  function addReaderDownloads() {
    var readers = 0;

    if ($('a[href$=".pdf"], a[href$=".PDF"]').length > 0) {
      $('#readers').append('<a class="download noexit" href="https://get.adobe.com/reader/" target="_blank" title="Download Adobe PDF Reader"><i class="icon-adobe-acrobat"></i><span class="sr-only">Adobe Acrobat Reader Download</span></a>');
      $('#readers').css('display', 'block');
      readers++;
    }

    if ($('a[href$=".doc"], a[href$=".docx"], a[href$=".docm"], a[href$=".rtf"], a[href$=".DOC"], a[href$=".DOCX"], a[href$=".DOCM"], a[href$=".RTF"]').length > 0) {
      $('#readers').append('<a class="download noexit" href="http://www.microsoft.com/en-us/download/details.aspx?id=4" target="_blank" title="Download Microsoft Word Viewer"><i class="icon-office-word"></i><span class="sr-only">Microsoft Word Viewer Download</span></a>');
      $('#readers').css('display', 'block');
      readers++;
    }

    if ($('a[href$=".xls"], a[href$=".xlsx"], a[href$=".xlsm"], a[href$=".XLS"], a[href$=".XLSX"], a[href$=".XLSM"]').length > 0) {
      $('#readers').append('<a class="download noexit" href="http://www.microsoft.com/en-us/download/details.aspx?id=10" target="_blank" title="Download Microsoft Excel Viewer"><i class="icon-office-excel"></i><span class="sr-only">Microsoft Excel Viewer Download</span></a>');
      $('#readers').css('display', 'block');
      readers++;
    }

    if ($('a[href$=".ppt"], a[href$=".pptx"], a[href$=".pptm"], a[href$=".PPT"], a[href$=".PPTX"], a[href$=".PPTM"]').length > 0) {
      $('#readers').append('<a class="download noexit" href="http://www.microsoft.com/en-us/download/details.aspx?id=13" target="_blank" title="Download Microsoft PowerPoint Viewer"><i class="icon-office-powerpoint"></i><span class="sr-only">Microsoft Power Point Viewer Download</span></a>');
      $('#readers').css('display', 'block');
      readers++;
    }

    if (readers > 1) {
      $('#readers').prepend('Download Readers: ');
    } else {
      $('#readers').prepend('Download Reader: ');
    }
  }

  function activeSubmenuLink() {
    var url = document.location.toString(),
        sel = '.sidebar-content li a[href*="' + url.split('/').pop().split('#')[0] + '"]',
        cur;

    // to find active link in the top navigation
    $('.nav-left-internal > li > a').each( function () {

      cur = $(this).attr('href');

      if (url.indexOf(cur) > 0) {
        $(this).parent('li').addClass('selected');
      } else {
        $(this).removeClass('selected, active');
      }
    });

    // to find active link in the left sidebar navigation

    $(sel).parent('li').addClass('selected').closest('.collapse').addClass('in').siblings('.panel-heading').find('a[data-toggle=collapse]').attr('aria-expanded', 'true');
  }

  $(document).ready(function () {

    MobileCheck();
    buildNavigation();
    breakURLS();
    addReaderDownloads();
    activeSubmenuLink();
//    $('.mobile-table').mobileTables();
//    $('img[src$=".svg"]').convertSVGsToInline();

//    $('#boxslider').flexslider({
//      animation: "slide",
//      controlNav: false,
//      animationLoop: false,
//      slideshow: false,
//      itemWidth: 120,
//      itemMargin: 0,
//      minItems: 2,
//      maxItems: 5,
//      asNavFor: '#mainslider'
//    });
//
//    $('#mainslider').flexslider({
//      animation: "fade",
//      slideshowSpeed: "7000",
//      controlNav: false,
//      directionNav: true,
////              manualControls: ".slider-tabs a",
//      customDirectionNav: $(".custom-direction-nav a"),
//      sync: "#boxslider"
//    });
//
//    $("#boxslider .slides li a").on('click', function (event) {
//      event.preventDefault();
//      window.open($(this).attr('href'));
//    });

    // Init parallax
    if (ieVer > 8 || ieVer === -1) {
      parallaxInit();
    }

    $("#skip-nav").click(function (event) {
      var skipTo = "#" + this.href.split('#')[1];

      $(skipTo).attr('tabindex', -1).on('blur focusout', function () {
        $(this).removeAttr('tabindex');
      }).focus();
    });

//    $('.accessibility-nav, .accessability-nav').accessibilityNav();

    $('.print-section').click(function (event) {
      event.preventDefault();
      $(this).closest('.row').printElement();
    });

    $(window).resize(function () {
      MobileCheck();
    });

    $(window).scroll(function () {
      if ($(this).scrollTop() > 150) { // Offset from the top
        $('.btn-2top').addClass('active');
      } else {
        $('.btn-2top').removeClass('active');
      }
    });

    $('.btn-2top').on('click', function (event) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 400);
    });

  });


}(jQuery));
