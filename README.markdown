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

    Q("/Products[?price<12.50]")
      .filter("[?name^='super']")
      .each(function(elem, index) {
          this.price++;
        })
      .put();

If someone is interested hit me up and I'll put more docs here.
