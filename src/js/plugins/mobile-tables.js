+(function ($) {
    'use strict';

    $.fn.mobileTables = function () {
        this.each(function () {
            var $table = $(this),
                $headers = $table.find('th');

            $table.find('tr').each(function () {
                $(this).find('td').each(function ( i ) {
                    var $cell = $(this);

                    if (!$cell.attr('data-label')) {
                        $(this).attr('data-label', $headers.eq(i).text());
                    }
                });
            });
        });

        return this;
    };
}(jQuery));
