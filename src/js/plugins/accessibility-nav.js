+(function ($) {
    'use strict';

    $.fn.accessibilityNav = function (options) {
        var config = $.extend({
                fontIncrement: 2,
                fontMax: 3
            }, options),
            baseFontSize = parseInt($('body').css('font-size')),
            fontIncrement = config.fontIncrement,
            fontMax = baseFontSize + (fontIncrement * config.fontMax),
            $decreaseText = this.find('#decrease-text'),
            $increaseText = this.find('#increase-text');

        $decreaseText.click(function () {
            var $el = $(this);

            if (!$el.hasClass('disabled')) {
                var newSize = parseInt($('body').css('font-size')) - fontIncrement;

                $('body').css('font-size', newSize);

                if (newSize <= baseFontSize) {
                    $el.addClass('disabled');
                }

                if (newSize >= fontMax - fontIncrement) {
                    $increaseText.removeClass('disabled');
                }
            }
        });

        $increaseText.click(function () {
            var $el = $(this);

            if (!$el.hasClass('disabled')) {
                var newSize = parseInt($('body').css('font-size')) + fontIncrement;

                $('body').css('font-size', newSize);

                if (newSize >= baseFontSize + fontIncrement) {
                    $decreaseText.removeClass('disabled');
                }

                if (newSize >= fontMax) {
                    $el.addClass('disabled');
                }
            }
        });

        return this;
    };
}(jQuery));
