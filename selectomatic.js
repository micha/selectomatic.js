(function() {

  window.Selectomatic = function(engine) {
    var $, i, j, argv=[];
    
    for (i=0, j=arguments.length; i<j; i++)
      argv[i] = arguments[i];

    $ = function(selector) {
      return new $.fn.init(selector);
    };

    $.fn = $.prototype = {

      init:       function(selector) {
                    var elems = [];

                    this.length   = 0;
                    this.selector = "";
                    this.method   = "init";

                    if (!$.engine.isSelector||!$.engine.init||!$.engine.find)
                      throw "Selector engine not installed.";
                          
                    if ($.engine.isSelector(selector)) {
                      this.selector = selector;
                      return this.setArray($.engine.init(selector, this));
                    } else {
                      if (selector instanceof $.fn.init)
                        return selector;
                      return this.setArray($.makeArray(selector));
                    }
                  },

      find:       function(selector) {
                    var ret = this.pushStack(
                      $.engine.find(selector, this.get()), 
                      "find",
                      selector
                    );
                    return ret;
                  },

      each:       function( callback, args ) {
                    return $.each( this, callback, args );
                  },

      size:       function(callback) {
                    return this.length;
                  },

      eq:         function(i) {
                    return this.slice( i, +i + 1 );
                  },

      get:        function(index) {
                    return index === undefined ?
                      // Return a 'clean' array
                      Array.prototype.slice.call(this) :
                      // Return just the object
                      this[index];
                  },

      index:      function(elem) {
                    return $.inArray(
                      elem && elem instanceof $.fn.init ? elem[0] : elem,
                      this
                    );
                  },

      json:       function(subject) { },

      filter:     function(selector) {
                    return this.pushStack(
                      $.isFunction(selector) &&
                        $.grep(this, function(elem, i){
                          return selector.call(elem, i);
                        }) ||
                        $.grep(this, function(elem, i) {
                          return !!$.engine.find(selector, [elem]).length;
                        }),
                      "filter",
                      selector
                    );
                  },

      is:         function(selector) {
                    return !!selector && 
                            $.engine.find(selector, this.get()).length > 0;
                  },

      map:        function(callback) {
                    return this.pushStack(
                      $.map(this, function(elem, i) {
                        return callback.call(elem, i, elem);
                      })
                    );
                  },

      not:        function(selector) {
                    if ($.engine.isSelector(selector))
                      selector = $.engine.find(selector, this.get());

                    var isArrayLike = selector.length && 
                          selector[selector.length - 1] !== undefined && 
                          !selector.nodeType;
                    return this.filter(function() {
                      return isArrayLike ? 
                          $.inArray(this, selector) < 0 : this != selector;
                    });
                  },

      slice:      function() {
                    return this.pushStack( 
                      Array.prototype.slice.apply(this, arguments),
                      "slice",
                      Array.prototype.slice.call(arguments).join(",")
                    );
                  },

      add:        function(selector) {
                    var isSelector = $.engine.isSelector(selector);
                    return this.pushStack(
                      $.unique(
                        $.merge(
                          this.get(),
                          isSelector ? 
                            $(selector).get() : 
                            $.makeArray(selector)
                        )
                      ),
                      "add",
                      isSelector ? selector : ""
                    );
                  },

      andSelf:    function() {
                    return this.add( this.prevObject );
                  },

      end:        function() {
                    return this.prevObject || $([]);
                  },

      pushStack:  function(elems, name, selector) {
                    var ret = $(elems);
                    ret.prevObject  = this;
                    ret.selector    = selector;
                    ret.method      = name;
                    return ret;
                  },

      setArray:   function(elems) {
                    this.length = 0;
                    Array.prototype.push.apply(this, elems);
                    return this;
                  },

    };

    $.fn.init.prototype = $.fn;

    $.argv = argv;

    jQuery.extend(true, $, engine);

    jQuery.extend(true, $, {
      each:       jQuery.each,
      extend:     jQuery.extend,
      grep:       jQuery.grep,
      makeArray:  jQuery.makeArray,
      map:        jQuery.map,
      inArray:    jQuery.inArray,
      merge:      jQuery.merge,
      unique:     jQuery.unique,
      isArray:    jQuery.isArray,
      isFunction: jQuery.isFunction,
      trim:       jQuery.trim,
      param:      jQuery.param,
    });

    return $;
  };

})();
