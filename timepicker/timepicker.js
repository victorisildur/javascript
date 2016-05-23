$.fn.timePicker = function(callback) {
    var $this = this,
        timer = $('.timepicker'),
        negBtn = timer.find('.js-neg-btn'),
        posBtn = timer.find('.js-pos-btn'),
        timeColContainer = timer.find('.time-col-container'),
        timeItemHeight = timer.find('.hour-col ul li').first().height();

    this.on('focus', function(e) {
        timer.show();
        e.preventDefault();
    });
    
    timeColContainer.on('scroll', function(e) {
        // 是否在"自动进坑"
        if ($(this).data('isTailing')) {
            return;
        }
        // 判断滚动方向
        if ($(this).data('lastScroll') < this.scrollTop) {
            $(this).data('scrollDir', 'down');
        } else {
            $(this).data('scrollDir', 'up');
        }
        $(this).data('lastScroll', this.scrollTop);
        
        // 100ms内滚动，则清掉timer
        if ($(this).data('timerId'))
            window.clearTimeout($(this).data('timerId'));

        // 设置定时器, 100ms未滚动才真正执行
        $(this).data('timerId', window.setTimeout(function() {
            if (this.scrollTop % timeItemHeight === 0)
                return;
            var remainder = 0,
                intervalId = 0,
                step = 0;
            if ($(this).data('scrollDir') === 'up') {
                remainder = this.scrollTop % timeItemHeight;
                step = -1 * remainder / 4;
                // 反向进坑
                if (remainder > (timeItemHeight / 2)) {
                    remainder = timeItemHeight - remainder;
                    step = remainder / 4;
                }
                $(this).data('isTailing', true);
            } else {
                remainder = timeItemHeight - (this.scrollTop % timeItemHeight);
                step = remainder / 4;
                $(this).data('isTailing', true);
                // 反向进坑
                if (remainder > (timeItemHeight / 2)) {
                    remainder = timeItemHeight - remainder;
                    step = -1 * remainder / 4;
                }
            }
            console.debug("自动进坑开始, remainder:" + remainder + ", scrollTop:" + this.scrollTop + ', step: ' + step);
            // 自动"进坑"
            intervalId = window.setInterval(function() {
                this.scrollTop = (this.scrollTop + step);
                remainder = remainder - Math.abs(step);
                if (remainder <= 0) {
                    console.debug("自动进坑结束, item height:" + timeItemHeight + ", scrollTop:" + this.scrollTop + ', setp: ' + step);
                    window.clearInterval(intervalId);
                    // 设置小时、分钟
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

$('#picker').timePicker(function(val1, val2) {
    console.debug('timepicker最终值：%s, %s', val1, val2);
});
