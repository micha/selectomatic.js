(function() {

    /*
     * This is a selector engine for the selectomatic library. It
     * provides a clientside javascript interface to the persevere 
     * JSON application server.
     *
     * Depends on:
     *   - jquery
     *   - dojo
     *   - jsonquery
     *   - selectomatic
     *
     * Use it like this:
     *   
     *   Json = Selectomatic(new JSONQueryEngine());
     *
     *   Json("/Products[?price<12.50]").each(function(elem, index) {
     *     this.price++;
     *   }).put();
     * 
     */

    // Define the static object.
    window.JSONQueryEngine = function() {
    };

    // Add the instance methods and properties.
    JSONQueryEngine.prototype = {
      // This is the selector engine itself.
      engine: {
        // Anything that is not a selector is assumed to be an element
        // that could be added to the collection.
        isSelector: function(what) {
          return typeof(what) === "string"; 
        },
        // This is called to get the initial set of elements.
        init: function(selector) {
          return [{a:"one"}, {a:"two"}, {a:"three"}];
        },
        // This is called to manipulate the existing set of elements.
        find: function(selector, elems) {
          return dojox.json.query(selector, elems);
        }
      },
      // This is how to define a static method in the plugin.
      doit: function() {
        alert("this is a static test!");
      },
      fn: {
        // This is how to define an instance method in the plugin.
        doit: function() {
          alert("this is an instance test!");
        }
      }
    };

 })();
