+(function ($) {
    'use strict';

    $.fn.mobileNavHeight = function () {
        var self = this,
            isOpen = false;

        if ($('.navbar-collapse').hasClass('in')) {
            isOpen = true;
        }

        setTimeout(function () {
            var newHeight;

            if (self.hasClass('navbar-toggle')) {
                newHeight = $('.navbar-nav').not('.navbar-nav.footer').height();
                $('.navbar-collapse').css('max-height', newHeight);

                if (isOpen) {
                    $('.navbar-collapse').css('height', '');
                }
            } else {
                if (self.hasClass('sub-nav')) {
                    newHeight = self.closest('li').children('ul').height();
//                    t.closest('li').children('ul').css('border','3px solid red');
//                    console.log(t.closest('li').find('ul').first());
//                    console.log('in: ' + newHeight);
                    $('.navbar-collapse').css('max-height', newHeight);

                    if (isOpen) {
                        $('.navbar-collapse').css('height', newHeight);
                    }
                } else if (self.hasClass('sub-nav-back')) {
                    newHeight = self.parent('ul').parent().closest('ul').height();
//                    t.parent('ul').parent().closest('ul').css('border','3px solid red');
//                    console.log(t.parent('ul').parent().closest('ul'));
//                    console.log('back: ' + newHeight);
                    $('.navbar-collapse').css('max-height', newHeight);

                    if (isOpen) {
                        $('.navbar-collapse').css('height', newHeight);
                    }
                }
            }
        }, 1);

        return this;
    };
}(jQuery));
