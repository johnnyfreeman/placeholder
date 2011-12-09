// anonymous self invoking function prevents $ from conflicting with another framework.
// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

    // placeHolder constructor
    var placeHolder = function(field, options)
    {
        this.init();
    };

    // plugin logic
    placeHolder.prototype = {

        // Set the default options
		// ------------------------
		// These can be overwritten by passing an object
		// literal with the options, like so:
		// 
		//     $('my_field').placeHolder({
		//         onRestore: function()
		//         {
		//             // do something when placeholder is restored
		//         },
		//         className: 'my-placeholder'
		//     });
	    options: {
	        className: 'placeholder',
	        freezeEvents: false,
	        onRestore: function()
	        {
	        	// console.log('onRestore fired!');
	        },
	        onClear: function()
	        {
	        	// console.log('onClear fired!');
	        }
	    },

        // the field is stored here and can 
        // be accessed thusly: this.field
        field: null,

        // flag (boolean) for the browser's compatability with 
        // the html5 placeholder attribute
        nativeSupport: "placeholder" in document.createElement("input"),

        // this lives outside the constructor so that it can 
        // be overwritten in a class extending this one and so that 
        // the jquery and mootools versions shared the same api
        init: function()
        {
            // save the element to the field 
            // property for future referance
            this.field = $(field);

            // $.extend is a method provided by jQuery that
            // merges the options passed in with the defaults
            $.extend(this.options, options);
            
            // add blur and focus events to the field and 
            // place them in the 'placeHolder' namespace so that
            // if later we want to unbind an event, we only unbind
            // the events bound by this plugin
            this.field.bind({
                'blur.placeHolder': this.restore,
                'focus.placeHolder': this.clear,
                // this step is done by implimenting the Events class in Mootools
                // since jQuery doesn't offer such functionality, we use jQuery's
                // bind method for adding custom events
                'restore.placeHolder': this.options.onRestore,
                'clear.placeHolder': this.options.onClear
            });

            // trigger the restore method immediately so that the value 
            // and placeholder classname will be set on page load.
            // we don't want the onRestore event to be fired a bunch of times on
            // page load so we'll freeze all events until the restore method 
            // has done it's thing
            this.options.freezeEvents = true;
            this.restore();
            this.options.freezeEvents = false;
        },
        
        restore: function(event)
        {
            // only restore the placeholder if the field is blank
            if (!this.field.val().length)
            {
                // add placeholder class
                this.field.addClass(this.options.className);

                // if current browser doesn't support the html5 placeholder 
                // attribute use it's placeholder text as the value
                if (!this.nativeSupport)
                {
                    this.field.val(this.field.attr('placeholder'));
                };

                // fire the onRestore event so long
                // as events have not been frozen
                if (!this.options.freezeEvents)
                {
                    this.field.trigger('restore.placeHolder');
                };
            };
        },
        
        clear: function(event)
        {
            // remove placeholder class
            this.field.removeClass(this.options.className);

            // if this field's value is same as it's placeholder,
            // erase the field's value and fire the onClear event.
            if (this.field.attr('placeholder') == this.field.val())
            {
                // erase the field's value only if the current browser 
                // doesn't support the html5 placeholder attribute
                if (!this.nativeSupport)
                {
                    this.field.val('');
                };

                // fire the onClear event so long
                // as events have not been frozen
                if (!this.options.freezeEvents)
                {
                    this.field.trigger('clear.placeHolder');
                };
            };
        }
    }

    placeHolder.options = placeHolder.prototype.options;

    // create a jquery plugin to instantiate the placeHolder object
    // all of the plugin logic is encapsulated in the placeHolder object itself
    $.fn.placeHolder = function(options) {
        return this.each(function() {
            return new placeHolder(this, options);
        });
    };

})(jQuery, window);