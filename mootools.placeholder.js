/**
 * Mootools Placeholder Plugin 1.0
 *
 * http://johnnyfreeman.github.com/placeholder/
 * Copyright 2011, Johnny Freeman
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($){
    
    var placeHolder = new Class({

        // Options and Events are classes provided by MooTools
        // used if your plugin has custom options and custom events
        Implements: [Options, Events],

        // Default options
        options: {
            className: 'placeholder',
            onRestore: function()
            {
                // console.log('onRestore fired!');
            },
            onClear: function()
            {
                // console.log('onClear fired!');
            }
        },

        freezeEvents: false, // allows events to be frozen
        field: null, // holds the field (element)
        nativeSupport: 'placeholder' in document.createElement('input'), // compatibility flag

        // constructor
        initialize: function(field, options)
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
            this.freezeEvents = true;
            this.restore();
            this.freezeEvents = false;

            return this;
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
                if (!this.freezeEvents)
                {
                    this.fireEvent('restore');
                };
            };

            return this;
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
                if (!this.freezeEvents)
                {
                    this.fireEvent('clear');
                };
            };

            return this;
        }
    });

    // expose the placeHolder object to the global scope
    window.placeHolder = placeHolder;

    Elements.implement({
        placeHolder: function(options){
            return this.each(function(element) {
                return element.placeHolder(options);
            });
        }
    });

    Element.implement({
        placeHolder: function(options){
            if (this.retrieve('placeHolder') === null) {
                this.store('placeHolder', new placeHolder(this, options));
            }
            return this;
        }
    });

})(document.id);