var timerHtml = require('../html/timepicker.html'),
    timerStyle = require('../less/timepicker.less');


var clickedComponent = null;

$.fn.timePicker = function(callback) {
    var shallBindEvt = false;
    if ($('body').find('.js-timepicker').length === 0) {
        $('body').append(timerHtml);
        shallBindEvt = true;
    }
    
    var timer = $('.js-timepicker'),
        negBtn = timer.find('.js-neg-btn'),
        posBtn = timer.find('.js-pos-btn'),
        timeColContainers = timer.find('.time-col-container'),
        itemHeight = 0;


    this.data('callback', callback);
    
    this.on('click', function(e) {
        timer.show();
        if (!timer.data('itemHeight'))
            timer.data('itemHeight', timer.find('.hour-col ul li').first().height());
        clickedComponent = $(this);
        e.preventDefault();
    });
    
    if (!shallBindEvt) {
        return;
    }
    
    timer.data('hour', 0);
    timer.data('min', 0);
    posBtn.on('click', function() {
        var hour = timer.data('hour'),
            min = timer.data('min');
        clickedComponent.data('callback')(hour, min);
        timer.hide();
    });

    
    timeColContainers.on('scroll', function(e) {
        var timeColContainer = $(this);
        // if container is auto-pitting
        if (timeColContainer.data('isTailing')) {
            return;
        }
        // set the scrolling direction
        if (timeColContainer.data('lastScroll') < this.scrollTop) {
            timeColContainer.data('scrollDir', 'down');
        } else {
            timeColContainer.data('scrollDir', 'up');
        }
        timeColContainer.data('lastScroll', this.scrollTop);
        
        // clear the timer if scrolled in 100ms
        if (timeColContainer.data('timerId'))
            window.clearTimeout(timeColContainer.data('timerId'));

        // set the timer, it'll only run when there is no scroll event in 100ms
        timeColContainer.data('timerId', window.setTimeout(function() {
            var remainder = 0,
                intervalId = 0,
                step = 0,
                itemHeight = timer.data('itemHeight');
            if (this.scrollTop % itemHeight === 0)
                return;
            if (timeColContainer.data('scrollDir') === 'up') {
                remainder = this.scrollTop % itemHeight;
                step = -1 * remainder / 4;
                // reversely auto-pitting
                if (remainder > (itemHeight / 2)) {
                    remainder = itemHeight - remainder;
                    step = remainder / 4;
                }
                timeColContainer.data('isTailing', true);
            } else {
                remainder = itemHeight - (this.scrollTop % itemHeight);
                step = remainder / 4;
                timeColContainer.data('isTailing', true);
                // reversely auto-pitting
                if (remainder > (itemHeight / 2)) {
                    remainder = itemHeight - remainder;
                    step = -1 * remainder / 4;
                }
            }
            
            // calc hour, min from this.scrollTop
            var val = Math.round((this.scrollTop + step*4)/itemHeight);
            if (timeColContainer.hasClass('hour-col')) {
                timer.data('hour', val);
            } else {
                timer.data('min', val);
            }

            console.debug("auto-pitting begins, remainder:" + remainder + ", scrollTop:" + this.scrollTop + ', step: ' + step);
            // auto-pitting
            intervalId = window.setInterval(function() {
                this.scrollTop = (this.scrollTop + step);
                remainder = remainder - Math.abs(step);
                if (remainder <= 0) {
                    console.debug("auto-pitting ends, item height:" + itemHeight + ", scrollTop:" + this.scrollTop + ', setp: ' + step);
                    window.clearInterval(intervalId);
                    window.setTimeout(function() {
                        timeColContainer.data('isTailing', false);
                    }.bind(this), 150);
                }
            }.bind(this), 100);
        }.bind(this), 100));
    });
    
    negBtn.on('click', function() {
        timer.hide();
    });
    
};
