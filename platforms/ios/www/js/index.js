var app = {
    
    step: 0,

    seconds: 0,

    intervalId: 0,

    initialize: function() {
        this.bindEvents();
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
            
            if (self.intervalId) {
                // we're stopping
                self.updateDisplay();               
            } else {
                self.seconds = self.recipe[self.step].minutes * 60;

                if (typeof(cordova) == "object") {
                    var timeExpired = new Date(new Date().getTime() + self.seconds * 1000);
                    cordova.plugins.notification.local.schedule({
                        id: 1,
                        text: "Es geht weiter!",
                        at: timeExpired,
                        data: {step: self.step + 1}
                    });                
                }

                self.intervalId = setInterval(function() {
                    self.tick();
                }, 1000);

                $(this).text('Stop');

            }
        });

        document.addEventListener("deviceready", function(){
            cordova.plugins.notification.local.on("click", function (notification, state) {
                self.step = notification.data.step;
                self.updateDisplay();
            });
            self.updateDisplay();
        });

        // for running locally
        $(document).ready(function(){
            self.updateDisplay();
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
        }
    },

    updateDisplay: function() {
        // clear interval since we're at a new step
        clearInterval(this.intervalId);
        this.intervalId = 0;
        if (typeof(cordova) == "object") {
            cordova.plugins.notification.local.cancel(1);
        }
        $('[data-action="timer"]').text('Start');

        var step = this.recipe[this.step];
        $('.title h1').text(step.title);
        $('.instruction .text').text(step.instruction);
        if (step.volume) {
            $('.instruction .volume').html(step.volume + " Liter").show();
        } else {
            $('.instruction .volume').hide();
        }
        if (step.temperature) {
            $('.instruction .temperature').html(step.temperature + " &deg;C").show();
        } else {
            $('.instruction .temperature').hide();
        }
        if (step.minutes) {
            $('.instruction .minutes').html(step.minutes + ":00").show();
            $('.instruction button').show();
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

    recipe: recipes.ipa
};
