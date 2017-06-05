#NETE Bootstrap 3
Please note this documentation is in-progress and currently incomplete.

## Introduction

The NETE Bootstrap Template is our own custom copy of Bootstrap 3, which has been customized with various improvements and code that we commonly reuse across our projects.

-----------

## Examples

### Text Resizer

Text resizing is a common feature which enhances accessibility of our sites by giving the users a control to increase the text size.

#### HTML

```html
<div class="accessability-nav">
    <a id="decrease-text" class="disabled" title="Decrease Text Size">A<sup>‐</sup><span class="sr-only">Decrease text size</span></a>
    <a id="increase-text" title="Increase Text Size">A<sup>+</sup><span class="sr-only">Increase text size</span></a>
    <a href="javascript:window.print()" title="Print">print<span class="sr-only">Print this Page</span></a>
</div>
```

----------

#### Javascript

```javascript
var baseFontSize = parseInt($('body').css('font-size')),
    fontIncrement = 2,
    fontMax = baseFontSize + (fontIncrement * 3);

$('.accessability-nav #decrease-text').click(function () {
    if (!$(this).hasClass('disabled')) {
        var newSize = parseInt($('body').css('font-size')) - fontIncrement;
        $('body').css('font-size', newSize);
        if (newSize <= baseFontSize) {
            $('.accessability-nav #decrease-text').addClass('disabled');
        }
        if (newSize >= fontMax - fontIncrement) {
            $('.accessability-nav #increase-text').removeClass('disabled');
        }
    }
});

$('.accessability-nav #increase-text').click(function () {
    if (!$(this).hasClass('disabled')) {
        var newSize = parseInt($('body').css('font-size')) + fontIncrement;
        $('body').css('font-size', newSize);
        if (newSize >= baseFontSize + fontIncrement) {
            $('.accessability-nav #decrease-text').removeClass('disabled');
        }
        if (newSize >= fontMax) {
            $('.accessability-nav #increase-text').addClass('disabled');
        }
    }
});
```

----------

