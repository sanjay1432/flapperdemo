var FlapBuffer = function (wrap, num_lines) {
    this.wrap = wrap;
    this.num_lines = num_lines;
    this.line_buffer = '';
    this.buffers = [
        []
    ];
    this.cursor = 0;
};

FlapBuffer.prototype = {

    pushLine: function (line) {

        if (this.buffers[this.cursor].length < this.num_lines) {
            this.buffers[this.cursor].push(line);
        } else {
            this.buffers.push([]);
            this.cursor++;
            this.pushLine(line);
        }
    },

    pushWord: function (word) {
        if (this.line_buffer.length == 0) {
            this.line_buffer = word;
        } else if ((word.length + this.line_buffer.length + 1) <= this.wrap) {
            this.line_buffer += ' ' + word;
        } else {
            this.pushLine(this.line_buffer);
            this.line_buffer = word;
        }
    },

    flush: function () {
        if (this.line_buffer.length) {
            this.pushLine(this.line_buffer);
            this.line_buffer = '';
        }
    },

};

var FlapDemo = function (display_selector, input_selector, click_selector) {
    var _this = this;

    var onAnimStart = function (e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').addClass('active');
    };

    var onAnimEnd = function (e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').removeClass('active');
    };

    var calculateWidth = 20;
    var windowWidth = $(window).outerWidth();
    var blockHeight = $(".display-container .displays").height();
    var blockWidth = $(".display-container .displays").width();
    var rows = 6;
    var rowHeight = 58;
    var boxWidth = 40;

    if (windowWidth >= 2500) {
        rowHeight = 132;
        boxWidth = 96;
    } else if (windowWidth >= 2200) {
        rowHeight = 132;
        boxWidth = 96;
    } else if (windowWidth >= 1920) {
        rowHeight = 100;
        boxWidth = 72;
    } else if (windowWidth >= 1326) {
        rowHeight = 76;
        boxWidth = 54;
    } else if (windowWidth >= 1024) {
        rowHeight = 58;
        boxWidth = 40;
    } else if (windowWidth >= 768) {
        rowHeight = 44;
        boxWidth = 30;
    } else if (windowWidth >= 600) {
        rowHeight = 44;
        boxWidth = 30;
    } else if (windowWidth >= 425) {
        rowHeight = 34;
        boxWidth = 24;
    } else if (windowWidth >= 375) {
        rowHeight = 34;
        boxWidth = 24;
    } else if (windowWidth >= 320) {
        rowHeight = 34;
        boxWidth = 24;
    }

    // var rows = Math.floor(blockHeight / rowHeight);
    var rows = 1;
    var htmlBlock = "";
    for (var i = 0; i < rows; i++) {
        htmlBlock += '<div class="display-block"><div class="activity"></div><input class="display'+i+'" /></div>';
    }

    $(".display-container .displays").html(htmlBlock);

    // if (windowWidth >= 2500) {
    //     $(".display-container .display0").addClass("XXL");
    //     calculateWidth = 23;
    // } else if (windowWidth >= 2200) {
    //     $(".display-container .display0").addClass("XXL");
    //     calculateWidth = 20;
    // } else if (windowWidth >= 1920) {
    //     $(".display-container .display0").addClass("XL");
    //     calculateWidth = 23;
    // } else if (windowWidth >= 1326) {
    //     $(".display-container .display0").addClass("L");
    // } else if (windowWidth >= 1024) {
    //     $(".display-container .display0").addClass("M");
    // } else if (windowWidth >= 768) {
    //     $(".display-container .display0").addClass("S");
    // } else if (windowWidth >= 600) {
    //     $(".display-container .display0").addClass("S");
    //     calculateWidth = 15;
    // } else if (windowWidth >= 425) {
    //     $(".display-container .display0").addClass("XS");
    //     calculateWidth = 12;
    // } else if (windowWidth >= 375) {
    //     $(".display-container .display0").addClass("XS");
    //     calculateWidth = 10;
    // } else if (windowWidth >= 320) {
    //     $(".display-container .display0").addClass("XS");
    //     calculateWidth = 8;
    // }


    // if (windowWidth >= 2500) {
    //     $(".display-container .display1").addClass("XXL");
    //     calculateWidth = 23;
    // } else if (windowWidth >= 2200) {
    //     $(".display-container .display1").addClass("XXL");
    //     calculateWidth = 20;
    // } else if (windowWidth >= 1920) {
    //     $(".display-container .display1").addClass("XL");
    //     calculateWidth = 23;
    // } else if (windowWidth >= 1326) {
    //     $(".display-container .display1").addClass("L");
    // } else if (windowWidth >= 1024) {
    //     $(".display-container .display1").addClass("M");
    // } else if (windowWidth >= 768) {
    //     $(".display-container .display1").addClass("S");
    // } else if (windowWidth >= 600) {
    //     $(".display-container .display1").addClass("S");
    //     calculateWidth = 15;
    // } else if (windowWidth >= 425) {
    //     $(".display-container .display1").addClass("XS");
    //     calculateWidth = 12;
    // } else if (windowWidth >= 375) {
    //     $(".display-container .display1").addClass("XS");
    //     calculateWidth = 10;
    // } else if (windowWidth >= 320) {
    //     $(".display-container .display1").addClass("XS");
    //     calculateWidth = 8;
    // }
    boxWidth = boxWidth + 6;
    calculateWidth = Math.floor(blockWidth / boxWidth);

    this.opts = {
        chars_preset: 'alphanum',
        align: 'left',
        width: calculateWidth,
        on_anim_start: onAnimStart,
        on_anim_end: onAnimEnd
    };

    this.timers = [];

    this.$displays = $(display_selector);
    this.num_lines = this.$displays.length;

    this.line_delay = 300;
    this.screen_delay = 7000;

    this.$displays.flapper(this.opts);

    this.$typesomething = $(input_selector);

    $(click_selector).click(function (e) {
        var text = _this.cleanInput(_this.$typesomething.val());
        console.log(text)
        _this.$typesomething.val('');

        if (text.match(/what is the point/i) || text.match(/what's the point/i)) {
            text = "WHAT'S THE POINT OF YOU?";
        }

        var buffers = _this.parseInput(text);

        _this.stopDisplay();
        _this.updateDisplay(buffers);

        e.preventDefault();
    });
};

FlapDemo.prototype = {

    cleanInput: function (text) {
        return text.trim().toUpperCase();
    },

    parseInput: function (text) {
        var buffer = new FlapBuffer(this.opts.width, this.num_lines);
        var lines = text.split(/\n/);

        for (i in lines) {
            var words = lines[i].split(/\s/);
            for (j in words) {
                buffer.pushWord(words[j]);
            }
            buffer.flush();
        }

        buffer.flush();
        return buffer.buffers;
    },

    stopDisplay: function () {
        for (i in this.timers) {
            clearTimeout(this.timers[i]);
        }

        this.timers = [];
    },

    updateDisplay: function (buffers) {
        var _this = this;
        var timeout = 100;

        for (i in buffers) {

            _this.$displays.each(function (j) {

                var $display = $(_this.$displays[j]);

                (function (i, j) {
                    _this.timers.push(setTimeout(function () {
                        if (buffers[i][j]) {
                            $display.val(buffers[i][j]).change();
                        } else {
                            $display.val('').change();
                        }
                    }, timeout));
                }(i, j));

                timeout += _this.line_delay;
            });

            timeout += _this.screen_delay;
        }
    }

};

$(document).ready(function () {

    new FlapDemo('input.display1', '#typesomething', '#showme');
    new FlapDemo('input.display0', '#secondLine', '#showme');
});

$(window).resize(function () {
    $("#showme").unbind("click");
    new FlapDemo('input.display0', '#typesomething', '#showme');
    // new FlapDemo('input.display1', '#secondLine', '#showme');
   
})