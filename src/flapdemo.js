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

var FlapDemo = function (display_selector, input_selector, click_selector, size) {
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
    var rows = size;
    var htmlBlock = "";
    for (var i = 0; i < rows; i++) {
        htmlBlock += '<div class="display-block"><div class="activity"></div><input class="display'+i+'" /></div>';
    }
    // for (var i = 0; i < rows; i++) {
    //     htmlBlock += '<div class="display-block"><div class="activity"></div><input class="display" /></div>';
    // }

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
    var k = []
    display_selector.forEach(element => {
         k.push($(element));
        $(element).flapper(this.opts);
        
    });
    this.$displays = k
    this.num_lines = this.$displays.length;

        this.line_delay = 300;
        this.screen_delay = 7000;
 
    

    // input_selector.forEach(element => {
    //     this.$typesomething = $(element);
    // });

    

    $(click_selector).click(function (e) {
        console.log(input_selector)
        var buffers = [];
        input_selector.forEach(element => {
            // this.$typesomething = $(element);
            var text = _this.cleanInput(element);

           
            console.log(text)
            // $(element).val('');
    
            if (text.match(/what is the point/i) || text.match(/what's the point/i )||text === "") {
                text = "WHAT'S THE POINT OF YOU?";
            }
            // console.log(_this.parseInput(text))
            var t = _this.parseInput(text);
             buffers.push(t[0]);      
        });
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
        return buffer.buffers[0];
    },

    stopDisplay: function () {
        for (i in this.timers) {
            clearTimeout(this.timers[i]);
        }

        this.timers = [];
    },

    updateDisplay: function (buffers) {
        var _this = this;
        for (i in buffers) {
                var $display = $(_this.$displays[i]);
                    $display.val(buffers[i]).change();
        }
    }

};

$(document).ready(function () {

    // new FlapDemo('input.display1', '#typesomething', '#showme');

    var userData = {
        Temp:'Temp 30 Deg',
        Rainy:'Rainy Yes',
        Day:'Day Sunday'
    }
    var size = Object.keys(userData).length;
    var display_selector = [];
    var input_selector = [];
    for (var i = 0; i < size; i++) {
        display_selector.push('input.display'+i);
    }
    for (var key in userData) {
        if (userData.hasOwnProperty(key)) {
            console.log(key + " -> " + userData[key]);
            input_selector.push(userData[key])
        }
    }


    new FlapDemo(display_selector,input_selector, '#showme',size);
});

$(window).resize(function () {
    $("#showme").unbind("click");
    var userData = {
        Temp:'Temp 30 Deg',
        Rainy:'Rainy Yes',
        Day:'Day Sunday'
    }
    var size = Object.keys(userData).length;
    var display_selector = [];
    var input_selector = [];
    for (var i = 0; i < size; i++) {
        display_selector.push('input.display'+i);
    }
    for (var key in userData) {
        if (userData.hasOwnProperty(key)) {
            input_selector.push(userData[key])
        }
    }


    new FlapDemo(display_selector,input_selector, '#showme',size);
    // new FlapDemo(['input.display0,input.display1'], ['#typesomething','#secondLine'], '#showme');
    // new FlapDemo('input.display1', '#secondLine', '#showme');
   
})