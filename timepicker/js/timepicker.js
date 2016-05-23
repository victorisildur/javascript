var timerHtml = require('../html/timepicker.html'),
    timerStyle = require('../less/timepicker.less');

$.fn.timePicker = function(callback) {
    if ($('body').find('.js-timepicker').length === 0) {
        $('body').append(timerHtml);
    }
    
    var $this = this,
        timer = $('.js-timepicker'),
        negBtn = timer.find('.js-neg-btn'),
        posBtn = timer.find('.js-pos-btn'),
        timeColContainer = timer.find('.time-col-container'),
        timeItemHeight = 0;

    this.on('click', function(e) {
        timer.show();
        timeItemHeight = timer.find('.hour-col ul li').first().height();
        console.debug('timeItemHeight:' + timeItemHeight);
        e.preventDefault();
    });
    
    timeColContainer.on('scroll', function(e) {
        // if container is auto-pitting
        if ($(this).data('isTailing')) {
            return;
        }
        // set the scrolling direction
        if ($(this).data('lastScroll') < this.scrollTop) {
            $(this).data('scrollDir', 'down');
        } else {
            $(this).data('scrollDir', 'up');
        }
        $(this).data('lastScroll', this.scrollTop);
        
        // clear the timer if scrolled in 100ms
        if ($(this).data('timerId'))
            window.clearTimeout($(this).data('timerId'));

        // set the timer, it'll only run when there is no scroll event in 100ms
        $(this).data('timerId', window.setTimeout(function() {
            if (this.scrollTop % timeItemHeight === 0)
                return;
            var remainder = 0,
                intervalId = 0,
                step = 0;
            if ($(this).data('scrollDir') === 'up') {
                remainder = this.scrollTop % timeItemHeight;
                step = -1 * remainder / 4;
                // reversely auto-pitting
                if (remainder > (timeItemHeight / 2)) {
                    remainder = timeItemHeight - remainder;
                    step = remainder / 4;
                }
                $(this).data('isTailing', true);
            } else {
                remainder = timeItemHeight - (this.scrollTop % timeItemHeight);
                step = remainder / 4;
                $(this).data('isTailing', true);
                // reversely auto-pitting
                if (remainder > (timeItemHeight / 2)) {
                    remainder = timeItemHeight - remainder;
                    step = -1 * remainder / 4;
                }
            }
            console.debug("auto-pitting begins, remainder:" + remainder + ", scrollTop:" + this.scrollTop + ', step: ' + step);
            // auto-pitting
            intervalId = window.setInterval(function() {
                this.scrollTop = (this.scrollTop + step);
                remainder = remainder - Math.abs(step);
                if (remainder <= 0) {
                    console.debug("auto-pitting ends, item height:" + timeItemHeight + ", scrollTop:" + this.scrollTop + ', setp: ' + step);
                    window.clearInterval(intervalId);
                    // calc hour, min from this.scrollTop
                    if ($(this).hasClass('hour-col')) {
                        $this.data('hour', Math.round(this.scrollTop/timeItemHeight));
                    } else {
                        $this.data('min', Math.round(this.scrollTop/timeItemHeight));
                    }
                    window.setTimeout(function() {
                        $(this).data('isTailing', false);
                    }.bind(this), 150);
                }
            }.bind(this), 100);

        }.bind(this), 100));
    });
    
    negBtn.on('click', function() {
        timer.hide();
    });
    
    posBtn.on('click', function() {
        var hour = $this.data('hour'),
            min = $this.data('min');
        callback(hour, min);
        timer.hide();
    });
};
