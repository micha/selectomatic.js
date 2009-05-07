
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

(function() {

    // Thanks alan...
    var _ajax_request = function(url, data, callback, type, method) {
      return jQuery.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        dataType: type
      });
    };

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
        init: function(selector, obj) {
          return [{a:"one"}, {a:"two"}, {a:"three"}];
        },
        // This is called to manipulate the existing set of elements.
        find: function(selector, elems) {
          return dojox.json.query(selector, elems);
        }
      },
      
      // Static methods for The Object

      get: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'GET');
      },
      put: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'PUT');
      },
      del: function(url, data, callback, type) {
        return _ajax_request(url, data, callback, type, 'DELETE');
      },
      post: function(url, data, callback) {
        jQuery.post(url, { data : toJSON(data) }, callback);
      }, 

      // Instance methods for The Object

      fn: {
        put: function() {
          var data = toJSON(this.get());
        }
      }
    };

 })();
