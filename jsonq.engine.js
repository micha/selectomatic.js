(function(){

/*
 * This is a selector engine for the selectomatic library. It
 * provides a clientside javascript interface to the persevere 
 * JSON application server.
 *
 * Depends on:
 *   - jquery
 *   - selectomatic
 *



Usage:

// Get the singleton.
Json = Selectomatic(new JSONQueryEngine("/Products"));

// Do an async GET, update some properties, and PUT back to the server.
Json("[?price<12.50]", function(data) {
  Json(data).each(function(elem, index) {
    this.price++;
  }).put();
});



 *
 * Thanks to everyone involved!
 * 
 */

    // Define the static object.
    window.JSONQueryEngine = function() {
    };

    // Add the instance methods and properties.

    JSONQueryEngine.prototype = {

      // This is the selector engine itself that you must define for
      // selectomatic.

      engine: {

        // Anything that is not a selector is assumed to be an element
        // that could be added to the collection.

        isSelector: function(what) {
          return typeof(what) === "string"; 
        },

        // This is called when the singleton is called with a selector.
        // You can have any number of arguments here, they are passed on
        // from the initial call to the singleton. Additionally, the 'this'
        // object is set to the new instance object.

        init: function(jsonstring) {
          var ret = window['eval']("("+jsonstring+")");
          return this.singleton.isArray(ret) ? ret : [ ret ];
        },

        // This is called to manipulate the existing set of elements.
        
        find: function(selector, elems) {
          return JSONQuery(selector, elems);
        }
      },
      
      // Static methods for The Object
              
      json: function(thing) {
        return JSON.stringify(thing);
      },

      // Instance methods for The Object

      fn: {
        pick: function(fields, inv) {
          var $ = this.singleton;
          return this.pushStack(
            this.map(function(i, e) {
              var ret={};
              $.each(this, function(k,v) {
                if ($.inArray(k,fields) != -1) {
                  if (!inv) ret[k] = v;
                } else {
                  if (!!inv) ret[k] = v;
                }
              });
              return ret;
            }).get(),
            "pick",
            [fields, !!inv]
          );
        },
        
        json: function() {
          var $ = this.singleton;
          return JSON.stringify(this.get());
        }
      }
    };

/*
 *  http://www.JSON.org/json2.js
 *  2009-04-16
 *
 *  Public Domain.
 *
 *  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 *  See http://www.JSON.org/js.html
 */

    window.JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }


/*
Copyright Jason E. Smith 2008 Licensed under the Apache License, Version 2.0 (the "License");
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/
 
 
/*
* CREDITS:
* Thanks to Kris Zyp from SitePen for contributing his source for
* a standalone port of JSONQuery (from the dojox.json.query module).
*
* OVERVIEW:
* JSONQuery.js is a standalone port of the dojox.json.query module. It is intended as
* a dropin solution with zero dependencies. JSONQuery is intended to succeed and improve upon
* the JSONPath api (http://goessner.net/articles/JsonPath/) which offers rich powerful
* querying capabilities similar to those of XQuery.
*
* EXAMPLES / USAGE:
* see http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/
*
*     *Ripped from original source.
*         JSONQuery(queryString,object)
        and
        JSONQuery(queryString)(object)
        always return identical results. The first one immediately evaluates, the second one returns a
        function that then evaluates the object.
      
      example:
        JSONQuery("foo",{foo:"bar"})
        This will return "bar".
    
      example:
        evaluator = JSONQuery("?foo='bar'&rating>3");
        This creates a function that finds all the objects in an array with a property
        foo that is equals to "bar" and with a rating property with a value greater
        than 3.
        evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
        This returns:
        {foo:"bar",rating:4}
      
      example:
        evaluator = JSONQuery("$[?price<15.00][\rating][0:10]");
        This finds objects in array with a price less than 15.00 and sorts then
        by rating, highest rated first, and returns the first ten items in from this
        filtered and sorted list.
        
        
	example:      
		var data = {customers:[
			{name:"Susan", purchases:29},
			{name:"Kim", purchases:150}, 
			{name:"Jake", purchases:27}
		]};
		
		var results = json.JSONQuery("$.customers[?purchases > 21 & name='Jake'][\\purchases]",data);
		results 
		
		returns customers sorted by higest number of purchases to lowest.

*/



    function map(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array(len);
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr)
                res[i] = fun.call(thisp, arr[i], i, arr);
        }
        
        return res;
    }
 
   function filter(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array();
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                var val = arr[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, arr))
                    res.push(val);
            }
        }
        
        return res;
    };
 
 
  function slice(obj,start,end,step){
    // handles slice operations: [3:6:2]
    var len=obj.length,results = [];
    end = end || len;
    start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
    end = (end < 0) ? Math.max(0,end+len) : Math.min(len,end);
     for(var i=start; i<end; i+=step){
       results.push(obj[i]);
     }
    return results;
  }
  function expand(obj,name){
    // handles ..name, .*, [*], [val1,val2], [val]
    // name can be a property to search for, undefined for full recursive, or an array for picking by index
    var results = [];
    function walk(obj){
      if(name){
        if(name===true && !(obj instanceof Array)){
          //recursive object search
          results.push(obj);
        }else if(obj[name]){
          // found the name, add to our results
          results.push(obj[name]);
        }
      }
      for(var i in obj){
        var val = obj[i];
        if(!name){
          // if we don't have a name we are just getting all the properties values (.* or [*])
          results.push(val);
        }else if(val && typeof val == 'object'){
          
          walk(val);
        }
      }
    }
    if(name instanceof Array){
      // this is called when multiple items are in the brackets: [3,4,5]
      if(name.length==1){
        // this can happen as a result of the parser becoming confused about commas
        // in the brackets like [@.func(4,2)]. Fixing the parser would require recursive
        // analsys, very expensive, but this fixes the problem nicely.
        return obj[name[0]];
      }
      for(var i = 0; i < name.length; i++){
        results.push(obj[name[i]]);
      }
    }else{
      // otherwise we expanding
      walk(obj);
    }
    return results;
  }
  
  function distinctFilter(array, callback){
    // does the filter with removal of duplicates in O(n)
    var outArr = [];
    var primitives = {};
    for(var i=0,l=array.length; i<l; ++i){
      var value = array[i];
      if(callback(value, i, array)){
        if((typeof value == 'object') && value){
          // with objects we prevent duplicates with a marker property
          if(!value.__included){
            value.__included = true;
            outArr.push(value);
          }
        }else if(!primitives[value + typeof value]){
          // with primitives we prevent duplicates by putting it in a map
          primitives[value + typeof value] = true;
          outArr.push(value);
        }
      }
    }
    for(i=0,l=outArr.length; i<l; ++i){
      // cleanup the marker properties
      if(outArr[i]){
        delete outArr[i].__included;
      }
    }
    return outArr;
  }
  var JSONQuery = function(/*String*/query,/*Object?*/obj){
    // summary:
    //     Performs a JSONQuery on the provided object and returns the results.
    //     If no object is provided (just a query), it returns a "compiled" function that evaluates objects
    //     according to the provided query.
    // query:
    //     Query string
    //   obj:
    //     Target of the JSONQuery
    //
    //  description:
    //    JSONQuery provides a comprehensive set of data querying tools including filtering,
    //    recursive search, sorting, mapping, range selection, and powerful expressions with
    //    wildcard string comparisons and various operators. JSONQuery generally supersets
    //     JSONPath and provides syntax that matches and behaves like JavaScript where
    //     possible.
    //
    //    JSONQuery evaluations begin with the provided object, which can referenced with
    //     $. From
    //     the starting object, various operators can be successively applied, each operating
    //     on the result of the last operation.
    //
    //     Supported Operators:
    //     --------------------
    //    * .property - This will return the provided property of the object, behaving exactly
    //     like JavaScript.
    //     * [expression] - This returns the property name/index defined by the evaluation of
    //     the provided expression, behaving exactly like JavaScript.
    //    * [?expression] - This will perform a filter operation on an array, returning all the
    //     items in an array that match the provided expression. This operator does not
    //    need to be in brackets, you can simply use ?expression, but since it does not
    //    have any containment, no operators can be used afterwards when used
    //     without brackets.
    //    * [^?expression] - This will perform a distinct filter operation on an array. This behaves
    //    as [?expression] except that it will remove any duplicate values/objects from the
    //    result set.
    //     * [/expression], [\expression], [/expression, /expression] - This performs a sort
    //     operation on an array, with sort based on the provide expression. Multiple comma delimited sort
    //     expressions can be provided for multiple sort orders (first being highest priority). /
    //    indicates ascending order and \ indicates descending order
    //     * [=expression] - This performs a map operation on an array, creating a new array
    //    with each item being the evaluation of the expression for each item in the source array.
    //    * [start:end:step] - This performs an array slice/range operation, returning the elements
    //    from the optional start index to the optional end index, stepping by the optional step number.
    //     * [expr,expr] - This a union operator, returning an array of all the property/index values from
    //     the evaluation of the comma delimited expressions.
    //     * .* or [*] - This returns the values of all the properties of the current object.
    //     * $ - This is the root object, If a JSONQuery expression does not being with a $,
    //     it will be auto-inserted at the beginning.
    //     * @ - This is the current object in filter, sort, and map expressions. This is generally
    //     not necessary, names are auto-converted to property references of the current object
    //     in expressions.
    //     *  ..property - Performs a recursive search for the given property name, returning
    //     an array of all values with such a property name in the current object and any subobjects
    //     * expr = expr - Performs a comparison (like JS's ==). When comparing to
    //     a string, the comparison string may contain wildcards * (matches any number of
    //     characters) and ? (matches any single character).
    //     * expr ~ expr - Performs a string comparison with case insensitivity.
    //    * ..[?expression] - This will perform a deep search filter operation on all the objects and
    //     subobjects of the current data. Rather than only searching an array, this will search
    //     property values, arrays, and their children.
    //    * $1,$2,$3, etc. - These are references to extra parameters passed to the query
    //    function or the evaluator function.
    //    * +, -, /, *, &, |, %, (, ), <, >, <=, >=, != - These operators behave just as they do
    //     in JavaScript.
    //    
    //  
    //  
    //   |  dojox.json.query(queryString,object)
    //     and
    //   |  dojox.json.query(queryString)(object)
    //     always return identical results. The first one immediately evaluates, the second one returns a
    //     function that then evaluates the object.
    //
    //   example:
    //   |  dojox.json.query("foo",{foo:"bar"})
    //     This will return "bar".
    //
    //  example:
    //  |  evaluator = dojox.json.query("?foo='bar'&rating>3");
    //    This creates a function that finds all the objects in an array with a property
    //    foo that is equals to "bar" and with a rating property with a value greater
    //    than 3.
    //  |  evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
    //     This returns:
    //   |  {foo:"bar",rating:4}
    //
    //  example:
    //   |  evaluator = dojox.json.query("$[?price<15.00][\rating][0:10]");
    //      This finds objects in array with a price less than 15.00 and sorts then
    //     by rating, highest rated first, and returns the first ten items in from this
    //     filtered and sorted list.
    tokens = [];
    var depth = 0;  
    var str = [];
    query = query.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g,function(t){
      depth += t == '[' ? 1 : t == ']' ? -1 : 0; // keep track of bracket depth
      return (t == ']' && depth > 0) ? '`]' : // we mark all the inner brackets as skippable
          (t.charAt(0) == '"' || t.charAt(0) == "'") ? "`" + (str.push(t) - 1) :// and replace all the strings
            t;
    });
    var prefix = '';
    function call(name){
      // creates a function call and puts the expression so far in a parameter for a call
      prefix = name + "(" + prefix;
    }
    function makeRegex(t,a,b,c,d){
      // creates a regular expression matcher for when wildcards and ignore case is used
      return str[d].match(/[\*\?]/) || c == '~' ?
          "/^" + str[d].substring(1,str[d].length-1).replace(/\\([btnfr\\"'])|([^\w\*\?])/g,"\\$1$2").replace(/([\*\?])/g,".$1") + (c == '~' ? '$/i' : '$/') + ".test(" + a + ")" :
          t;
    }
    query.replace(/(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,function(){
      throw new Error("Unsafe function call");
    });
    
    query = query.replace(/([^=]=)([^=])/g,"$1=$2"). // change the equals to comparisons
      replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g,function(t){
        return t.charAt(0) == '.' ? t : // leave .prop alone
          t == '@' ? "$obj" :// the reference to the current object
          (t.match(/:|^(\$|Math|true|false|null)$/) ? "" : "$obj.") + t; // plain names should be properties of root... unless they are a label in object initializer
      }).
      replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,function(t,a,b){
        var oper = t.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/); // [?expr] and ?expr and [=expr and =expr
        if(oper){
          var prefix = '';
          if(t.match(/^\./)){
            // recursive object search
            call("expand");
            prefix = ",true)";
          }
          call(oper[1].match(/\=/) ? "map" : oper[1].match(/\^/) ? "distinctFilter" : "filter");
          return prefix + ",function($obj){return " + oper[2] + "})";
        }
        oper = t.match(/^\[\s*([\/\\].*)\]/); // [/sortexpr,\sortexpr]
        if(oper){
          // make a copy of the array and then sort it using the sorting expression
          return ".concat().sort(function(a,b){" + oper[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g,function(t,a,b){
              return "var av= " + b.replace(/\$obj/,"a") + ",bv= " + b.replace(/\$obj/,"b") + // FIXME: Should check to make sure the $obj token isn't followed by characters
                  ";if(av>bv||bv==null){return " + (a== "/" ? 1 : -1) +";}\n" +
                  "if(bv>av||av==null){return " + (a== "/" ? -1 : 1) +";}\n";
          }) + "})";
        }
        oper = t.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/); // slice [0:3]
        if(oper){
          call("slice");
          return "," + (oper[1] || 0) + "," + (oper[2] || 0) + "," + (oper[3] || 1) + ")";
        }
        if(t.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)){ // ..prop and [*]
          call("expand");
          return (t.charAt(1) == '.' ?
              ",'" + b + "'" : // ..prop
                t.match(/,/) ?
                  "," + t : // [prop1,prop2]
                  "") + ")"; // [*]
        }
        return t;
      }).
      replace(/(\$obj\s*(\.\s*[\w_$]+\s*)*)(==|~)\s*`([0-9]+)/g,makeRegex). // create regex matching
      replace(/`([0-9]+)\s*(==|~)\s*(\$obj(\s*\.\s*[\w_$]+)*)/g,function(t,a,b,c,d){ // and do it for reverse =
        return makeRegex(t,c,d,b,a);
      });
    query = prefix + (query.charAt(0) == '$' ? "" : "$") + query.replace(/`([0-9]+|\])/g,function(t,a){
      //restore the strings
      return a == ']' ? ']' : str[a];
    });
    // create a function within this scope (so it can use expand and slice)
    
    var executor = eval("1&&function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj=$;return " + query + "}");
    for(var i = 0;i<arguments.length-1;i++){
      arguments[i] = arguments[i+1];
    }
    return obj ? executor.apply(this,arguments) : executor;
  };
  
  
  if(typeof namespace == "function"){
  	namespace("json::JSONQuery", JSONQuery);
  }
  else {
  	//window["JSONQuery"] = JSONQuery;
  }
})();
