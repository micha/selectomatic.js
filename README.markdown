How to Use
==========

  * Requires jQuery v1.3
  * Requires a selector engine (provided by you).
  * Have a look at the file _jsonq.engine.js_ to see an example selector
    engine.

Load the Scripts
----------------

Let's assume that your selector engine (more about that later) is defined
in a file called _engine.js_ and the engine object it defines is `Engine`.

Load the scripts in your document head as follows:

    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="selectomatic.js"></script>
    <script type="text/javascript" src="your.selector.engine.js"></script>

Then you can instntiate your `Selectomatic` like this:

    Q = Selectomatic(new Engine());

Now the `Q` object is a jQuery-like object, with all the awesome collections
managment and chaining patterns. You can then do something like this with it:

    Q("[?price<12.50]")
      .filter("[?name^='super']")
      .each(function(elem, index) {
          this.price++;
        })
      .json();

Selectomatic
============

This is the framework for creating queryable collections objects. All the
methods are similar to what you would find in jQuery, but with the CSS
selector engine and DOM specificity removed and abstracted out.

Singleton Methods
-----------------

* *each():*
* *extend():*
* *grep():*
* *makeArray():*
* *map():*
* *inArray():*
* *merge():*
* *unique():*
* *isArray():*
* *isFunction():*
* *trim():*
* *param():*

Instance Methods
----------------

* *find():*
* *each():*
* *size():*
* *eq():*
* *get():*
* *index():*
* *filter():*
* *is():*
* *map():*
* *not():*
* *slice():*
* *add():*
* *andSelf():*
* *end():*
* *pushStack():*
* *setArray():*

If someone is interested hit me up and I'll put more docs here.

JSONQueryEngine
===============

This is a query engine for selectomatic.js.

Singleton Methods
-----------------

* *json(_object_):* Returns a JSON string representation of the object.

Instance Methods
----------------

* *pick(_array_, _invert_):* Picks the properties specified in _array_ from
  each element in the selection, deleting all other properties. Basically,
  if you think of the JSON data as a table, this selects the columns. If the
  _invert_ argument is true then the selection is inverted.

* *json():* Returns a JSON representation of the selection array.
