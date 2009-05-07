(function() {

    window.JSONQueryEngine = function() {
    };

    JSONQueryEngine.prototype = {
      engine: {
        isSelector: function(what) {
          return typeof(what) === "string"; 
        },
        init: function(selector) {
          return [{a:"one"}, {a:"two"}, {a:"three"}];
        },
        find: function(selector, elems) {
          return dojox.json.query(selector, elems);
        }
      },
      doit: function() {
        alert("this is a static test!");
      },
      fn: {
        doit: function() {
          alert("this is an instance test!");
        }
      }
    };

 })();
