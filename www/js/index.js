var app = {
    
    step: 0,

    seconds: 0,

    intervalId: null,

    initialize: function() {
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents: function() {
        var self = this;
        $('[data-action="done"]').on('click', function(event) {
            event.preventDefault();
            
            self.step++;
            self.updateDisplay();

            // fancy animation if we are on iOS and not on development environment
            if (typeof(nativetransitions) == 'object') {
                nativetransitions.curl(0.5, 'up');
            }
        });
        $('[data-action="back"]').on('click', function(event) {
            event.preventDefault();
            
            self.step--;
            self.updateDisplay();

            // fancy animation if we are on iOS and not on development environment
            if (typeof(nativetransitions) == 'object') {
                nativetransitions.curl(0.5, 'down');
            }
        });
        $('[data-action="timer"]').on('click', function(event) {
            event.preventDefault();
            
            $(this).prop('disabled', true);
            self.intervalId = setInterval(function() {
                self.tick();
            }, 1000);
        });
    },

    tick: function() {
        this.seconds--;
        var minutes = Math.floor(this.seconds / 60);
        var prefix = ((this.seconds % 60) < 10) ? '0' : '';
        $('.instruction .minutes').text(minutes + ':' + prefix + (this.seconds % 60));
        if (this.seconds == 0) {
            clearInterval(this.intervalId);
            $('[data-action="timer"]').prop('disabled', false);
            this.step++;
            this.updateDisplay();
        }
    },

    updateDisplay: function() {
        var step = this.recipe[this.step];
        $('.title h1').text(step.title);
        $('.instruction .text').text(step.instruction);
        if (step.temperature) {
            $('.instruction .temperature').html(step.temperature + " &deg;C").show();
        } else {
            $('.instruction .temperature').hide();
        }
        if (step.minutes) {
            $('.instruction .minutes').html(step.minutes + ":00").show();
            $('.instruction button').show();
            this.seconds = step.minutes * 60;
        } else {
            $('.instruction .minutes').hide();
            $('.instruction button').hide();

        }

        if (this.step == 0) {
            $('[data-action="back"]').prop('disabled', true);
        } else {
            $('[data-action="back"]').prop('disabled', false);
        }

        if (this.step == this.recipe.length - 1) {
            $('[data-action="done"]').prop('disabled', true);            
        } else {
            $('[data-action="done"]').prop('disabled', false);
        }
    },

    recipe: [
        {
            title: "Einmaischen",
            instruction: "Erhitze 8 Liter Wasser auf 60 Grad",
            temperature: 60
        },
        {
            title: "Einmaischen",
            instruction: "Gebe das Malz dazu, rühre alles ein"
        },
        {
            title: "Einmaischen",
            instruction: "Lasse den Maisch wärend 20 Minuten auf 55 Grad kochen",
            temperature: 55,
            minutes: 1
        },
        {
            title: "Scho färtig",
            instruction: "Isch ja nur ä Demo, gäll :)"
        },
    ]
};
