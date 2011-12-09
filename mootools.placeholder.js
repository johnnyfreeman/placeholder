// placeholder class rewritten to use Mootools' Class object
var placeHolder = new Class({

	// Options and Events are classes provided by MooTools
	// used if your plugin has custom options and custom events
	Implements: [Options, Events],

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

    // flag (boolean) for the browser's compatability with the html5 placeholder attribute
    nativeSupport: "placeholder" in document.createElement("input"),

    // Class constructor gets run upon instantiation
    initialize: function(field, options)
    {
    	this.init(field, options);
    },

    // this lives outside the constructor so that it can 
    // be overwritten in a class extending this one and so that 
    // the jquery and mootools versions shared the same api
    init: function(field, options)
    {
        // save the element to the element 
    	// property for future referance
        this.field = field;

        // setOptions is a method provided by the Options mixin
	    // it merges the options passed in with the defaults
	    this.setOptions(options);

	    // add blur and focus events to the field and 
        // overwrite (bind) 'this' with the placeHolder object
        this.field.addEvents({
            blur: this.restore.bind(this),
            focus: this.clear.bind(this)
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
        if (!this.field.getProperty('value').length)
        {
        	// add placeholder class
            this.field.addClass(this.options.className);

            // if current browser doesn't support the html5 placeholder attribute
            // use it's placeholder text as the value
            if (!this.nativeSupport)
            {
            	this.field.setProperty('value', this.field.getProperty('placeholder'));
            };

			// fire the onRestore event so long
			// as events have not been frozen
            if (!this.options.freezeEvents)
            {
            	this.fireEvent('restore');
            };
        };
    },
    
    clear: function(event)
    {
    	// remove placeholder class
    	this.field.removeClass(this.options.className);

    	// if this field's value is same as it's placeholder,
    	// erase the field's value and fire the onClear event.
    	if (this.field.getProperty('placeholder') == this.field.getProperty('value'))
        {
        	// erase the field's value only if the current browser 
        	// doesn't support the html5 placeholder attribute
        	if (!this.nativeSupport)
        	{
        		this.field.setProperty('value', '');
        	};

			// fire the onClear event so long
			// as events have not been frozen
	        if (!this.options.freezeEvents)
	        {
	        	this.fireEvent('clear');
	        };
        };
    }
});

// Extend the Elements object so that the placeHolder method
// will instatiate the placeHolder object. Basically, it 
// enables you to chain this plugin on an array of Element 
// objects like so: 
// 
// 		$$('.my_textboxes').placeHolder();
// 
Elements.implement({
    placeHolder: function(options){
        return this.each(function(element) {
            return new placeHolder(element, options);
        });
    }
});

// Extend the Element object so that the placeHolder method
// will instatiate the placeHolder object. Basically, it 
// enables you to chain this plugin directly on an Element 
// objects like so: 
// 
// 		$('my_field').placeHolder();
// 
Element.implement({
    placeHolder: function(options){
        return new placeHolder(this, options);
    }
});