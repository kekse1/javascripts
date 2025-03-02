<img src="https://kekse.biz/github.php?draw&override=github:javascripts" />

Every JavaScript is made by myself, arose out of necessity.. or because I found it interesting.

> [!INFO]
> For the future I'm planning to sort all the scripts in here by their line counts. JFYI..

> [!INFO]
> I think **most** scripts should run 'as is', due to the nature of **vanilla** JavaScript
> (whereas I'm mostly using the [**Node.js**](https://nodejs.org/)).

## Index
1. [News](#news)
2. [Scripts](#scripts)
    * [`dump`.js](#dumpjs)
	* [`offset`.js](#offsetjs)
	* [`clone`.js](#clonejs)
	* [`config`.js](#configjs)
	* [`links`.js](#linksjs)
    * [`bytes`.js](#bytesjs)
	* [`reflection`.js](#reflectionjs)
	* [`intersect`.js](#intersectjs)
	* [`multiset`.js](#multisetjs)
	* [`escaping`.js](#escapingjs)
    * [`newlines`.js](#newlinesjs)
	* [`measure`.js](#measurejs)
	* [`animation`.js](#animationjs)
	* [`moon`.js](#moonjs)
	* [`fill`.js](#filljs)
	* [`chess`.js](#chessjs)
	* [`street-split`.js](#street-splitjs)
	* [`fold.css`.js](#foldcssjs)
3. [Contact](#contact)
4. [Copyright and License](#copyright-and-license)

## News
* \[**2025-01-14**\] Created [**`newlines`.js**](#newlinesjs), v**0.1.0**;
* \[**2025-01-10**\] Update in my [**`config`.js**](#configjs), to v**0.8.0**;
* \[**2024-12-24**\] Uploaded my [**`chess`.js**](#chessjs), v**0.2.1**;
* \[**2024-12-13**\] Updated [**`fill`.js**](#filljs), now v**0.1.1**;
* \[**2024-12-03**\] Created [**`bytes`.js**](#bytesjs), v**0.1.0**;
* \[**2024-11-26**\] Created [**`escaping`.js**](#escapingjs), v**0.2.0**;
* \[**2024-11-25**\] Updated [**`clone`.js**](#clonejs), v**0.5.1**;
* \[**2024-11-05**\] Updated the new [**`measure`.js**](#measurejs) to v**0.2.1**;
* \[**2024-09-24**\] **Moved** the [**`offset`.js**](#offsetjs) script to my [new **`utilities`** repository](https://github.com/kekse1/utilities/);
* \[**2024-09-24**\] Created this repository, to move only the JavaScripts from my [**`scripts` repository**](https://github.com/kekse1/scripts/) to here.

## JavaScripts
My favorite language.. absolutely. **^\_^**

Many, many years ago I just laughed about JavaScript, because it was just some 'browser scripting language'..
TODAY, in the times of [`Node.js`](https://nodejs.org/), it's a great language, even for the server side! **;-)**

Every script is made by myself, arose out of necessity.. or because I found it interesting.


<a href="https://github.com/kekse1/dump.js/">
<img id="dumpjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60dump.js%60" />
</a>

Got it's own [repository **`dump.js`**](https://github.com/kekse1/dump.js/)


<a href="src/offset.js">
<img id="offsetjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60offset.js%60" />
</a>

With this script, you can calculate and convert between offsets and lines with columns,
or count them, etc. Without any parameter it'll show you the whole countings, and with
another parameter combination you can even get to know how many columns a specific line has.

* [Version v**1.0.2**](src/offset.js) (updated **2024-10-06**)

> [!TIP]
> Start with the argv parameter `--help` or `-?`. ;-)


<a href="src/clone.js">
<img id="clonejs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60clone.js%60" />
</a>

* [Version v**0.5.1**](src/clone.js) (updated **2024-11-25**)

My `Reflect.clone()` extension (because JavaScript doesn't include it natively)..

.. and it works great, really! **:-)** Also checks `Reflect.isExtensible()`, so even functions with
extensions are being fully cloned. And even the functions themselves (if `_function === true`; see also
`DEFAULT_CLONE_FUNCTION`).. and - utilizing a `Map` - every instance will only get cloned **once**, so
**no circular dependencies** occure! **;-)**

> [!INFO]
> Since v**0.5.0** the function also supports any type of `TypedArray`.


<a href="src/config.js">
<img id="configjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60config.js%60" />
</a>

* [Version v**0.8.0**](src/config.js) (updated **2025-01-10**)

Using a regular `.json` file/structure. But with improved handling.

> [!IMPORTANT]
> It ain't runnable in a regular JavaScript environment,
> since it's using extensions I've only got in my own code.
> **But** the algorithms and structures should be correct and
> clear when you are looking in the code for yourself.

Example given: { server: { host: 'localhost', { http: { port: 8080 } } } };
You can `.get('server.http.host');` and nevertheless get the `host` above it.

It's possible to receive an array with all upper definitions, and via `_index`
argument to select one (-1 for the last, deepest one, e.g.). You can also FORCE
a concrete item without parents, see '.force()'.

The `.with()` function is meant for e.g. { enabled: (bool) }. It checks all upper
occurencies, if there's at least one (`false/true`) value. So you can 'globally'
disable/enable smth., even if deeper occurencies enable smth. I needed/wanted this;
.. usable by `.enabled()` and `.disabled()` (chooses the test with one of `true/false`).

You can, btw., init with config object using `{,static} wrap(_object, ..)`;
or just argue with such a base object in any constructor argument. AND now
you can also `.extend()` with kinda 'chroot' sub paths (so your query paths
can start in a sub object).. and now, since v**0.6.0** I also support the
'step-wise' traversing up the paths. So not only any chroot path, but **every**
path item (see `Configuration.delim`)!


<a href="src/links.js">
<img id="linksjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60links.js%60" />
</a>

* [Version v**0.8.3**](src/links.js) (updated **2024-05-02**)

This class extracts all links from `.html` files. It should work better than
regular expressions, since it covers many possible codes. And this class should
be instanciated, so it also works with file chunks (this way, the input data does
not have to be complete, which is great for streams; also to save memory, etc.).

And see the `DEFAULT_ATTRIBS = [ 'href', 'src' ];`; or maybe define a filter,
like the `DEFAULT_SCHEME = [ 'http:', 'https:' ]`, so only these links will
remain in the result array; you can also instanciate with a `source` param
or attrib: from which URL this HTML document comes from, so the links are
adapted to it (relative links could be a problem otherwise).

Since v**0.4.0** also with `DEFAULT_UNIQUE = true`; extra `.extract()` function
(original `.onData()` was meant for stream events); plus some improvements and
bugs fixed. And more **big changes** since v**0.5.0**.

PLUS: since v**0.8.0** it can extract ALL links, not only those from HTML codes;
e.g. `text/plain`; BUT you need (beneath `.all` or `DEFAULT_ALL`) also at least
one `.scheme[]` item..

Nice one; have phun.


<a href="src/bytes.js">
<img id="bytesjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60bytes.js%60" />
</a>

* [Version v**0.1.0**](src/bytes.js) (created **2024-12-03**)

This is radix/base conversion, but only for bytecode (so
radix/base 256). Here's only the BigInt part, for regular
Integers you could change it a bit, or you use the 'power'
of Typed Arrays (which I don't like that much..).

You could use it for more efficient encoding of numbers,
on disk or via network transmission, etc.

<a href="src/reflection.js">
<img id="reflectionjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60reflection.js%60" />
</a>

* [Version v**3.1.0**](src/reflection.js) (updated **2024-09-15**)

My solution for JavaScript's `instanceof` problem, so when in multiple environments
the classes are initialized/declared not once. In this case, comparing two environments,
it's like `Array !== Array`, e.g.. and I don't mean only the instances, the base classes
are being created multiple times in multiple environments..

So I'm using `[Reflect.]is()` and `[Reflect.]was()` (for a long time, so it's well tested,
and works great). You'll find _more description_ in this [`reflection`.js](src/reflection.js), in
the starting comment on top of the file.

> [!IMPORTANT]
> Since v**2.1.0** the additional `was()` parameters (varargs) mean **AND**, **not** **OR**
> any longer.. but the `is()` stayed the same (**OR**);

> [!TIP]
> In v**3.1.0** **improved/fixed** `Object.{has,get,set,remove}()`** (traversing functions)!


<a href="src/intersect.js">
<img id="intersectjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60intersect.js%60" />
</a>

* [Version v**0.2.2**](src/intersect.js) (created **2024-07-07**)

Intersection for Arrays. Works with any data type (so no optimization like
binary search possible here), and respects multiple occurences (if no (true)
is in your arguments).

**Depends** on my [`multiset`.js](#multisetjs)!!


<a href="src/multiset.js">
<img id="multisetjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60multiset.js%60" />
</a>

* [Version v**0.2.0**](src/multiset.js) (created **2024-04-30**)

My `MultiSet` class: extends `Map`, but works like a `Set`, with the difference
that it also counts the amount of items in this set.


<a href="src/escaping.js">
<img id="escapingjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60escaping.js%60" />
</a>

String extensions to support C {un,}escaping.
Example given `\n` is the newline character.

* [Version v**0.2.0**](src/escaping.js) (created **2024-11-26**)

Supports both escaping and unescaping. The latter will
produce strings with the encoded values, so `\n` will
become a real newline byte, and the first one will
encode the string `\n` out of the `\10` byte code.


<a href="src/newlines.js">
<img id="newlinesjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60newlines.js%60" />
</a>

> [!TIP]
> Count and/or convert your text files with this little tool
> (instead of the old `dos2unix` etc.)!

* [Version v**0.1.0**](src/newlines.js) (created **2025-01-14**)

Counts any occurence of various (UNIX, DOS, MAC) newlines
if called without additional parameters; as follows:

* **`-d / --dos`**
* **`-u / --unix`**
* **`-m / --mac`**
* \[ `-c / --count` \]

They define the optional target format to which the input
will be converted to. Optional, and only one of them per
call (last occurence rules).

If `stdin` is being filled, no additional file path parameter
will be used. Or define any amount of file paths - they get
used in order. The `-` file is also allowed (also `stdin`).

Files that don't exist or files with open/read errors will
always throw an exception.

`stdout` is the place where either the count result will be,
or with enabled conversion `stdout` is the place for the new
data - `stderr` in this case for the count summary at the end.


<a href="src/measure.js">
<img id="measurejs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60measure.js%60" />
</a>

* [Version v**0.2.1**](src/measure.js) (updated **2024-11-05**)

Two functions to measure the **throughput** of your data, in bytes per second (just
remove the multiplication with 1000 für milliseconds); and the **ETA** ('Estimated
Time Of Arrival') w/ `.remaining()`, in milliseconds (multiply *1000 for seconds).


<a href="https://github.com/kekse1/v4/blob/git/src/web/animation.js">
<img id="animationjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60animation.js%60" />
</a>

This is just a link to the only [`animation`.js](https://github.com/kekse1/v4/blob/git/src/web/animation.js) of my
[v4 project](https://github.com/kekse1/v4/).

Some extensions to the [**Web Animations API**](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API);
**very** necessary for my special needs.. it's also the one with the most lines.

Maybe useful for you? But you've to read the source for yourself; and some functions may be missing;
then look at my [v4 source code](https://kekse.biz/?~sources)!


<a href="src/moon.js">
<img id="moonjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60moon.js%60" />
</a>

Extends the `Date` object with moon phase calculation functions.

* [Version v**0.2.3**](src/moon.js) (created **2024-08-04**)

> [!WARN]
> MAYBE old version?? For more, partially very useful `Date` extensions take a look (for docs and concrete code):
> * [**v4**/docs (...)](https://github.com/kekse1/v4/blob/git/docs/modules/lib/date.md)
> * [`date.js`](https://github.com/kekse1/v4/blob/git/js/lib/globals/date.js)


<a href="src/fill.js">
<img id="filljs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60fill.js%60" />
</a>

I'm a bit embarrassed about this script - it's just so really tiny and nothing..

* [Version v**0.1.1**](src/fill.js) (updated **2024-12-13**)

But I really needed it one time. Read the description in the comment on top of this file.


<a href="src/chess.js">
<img id="chessjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60chess.js%60" />
</a>

Little '**toy**'! "Maps" some counted values in a coordinate system,
so it **draws kinda chess board** .. in your **console**/**terminal**! ;-)

* [Version v**0.2.1**](src/chess.js) (uploaded **2024-12-24**);

![`example()`](img/chess.png)

**DEPENDS** on my own library, so you've to adapt this script for your own!


<a href="src/street-split.js">
<img id="street-splitjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60street-split.js%60" />
</a>

* [Version v**0.2.0**](src/street-split.js) (updated **2024-06-03**)

It's merely kinda **proof of concept** that state parsers can be as good as regular expressions, or even better! **;-D**
See also [**this discussion**](https://www.php.de/forum/webentwicklung/php-einsteiger/1614566-stra%C3%9Fe-und-hausnummer-korrekt-trennen);


<a href="src/fold.css.js">
<img id="foldcssjs" src="https://kekse.biz/github.php?override=github:javascripts&draw&angle=3&size=28&fg=140,130,20&font=OpenSans&ro&readonly&v=48&h=48&text=%60fold.css.js%60" />
</a>

* [Version v**0.1.0**](src/fold.css.js) (updated **2024-03-04**)

'Folds' CSS style code. Earlier I used the `fold` (Linux) command, but that didn't work that well for what
I needed the resulting code: had to filter out CSS classes in `.html` code and `grep` for them in many
`.css` files - since `grep` is for lines, and `cut` is too stupid, .. I couldn't find the CSS styles in
stylesheets without newlines, etc. ..

The reason for this script was: I wanted to 'import' GitHub's markdown `.css` code, since [my website](https://kekse.biz/)
[provides all **my GitHub repositories**](https://kekse.biz/?~projects), and I needed only some parts out of there..
but the code is/was a mess!

> [!IMPORTANT]
> Early version, so only the real basics are covered.

# Contact
<img src="https://kekse.biz/github.php?override=github:javascripts&draw&text=javascripts@kekse.biz&angle=6&size=38pt&fg=150,20,90&font=OpenSans&ro&readonly&h=64&v=16" />

# Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](./COPYRIGHT.txt),
and it's licensed under the [MIT](./LICENSE.txt) (also known as 'X' or 'X11' license).

<a href="https://kekse.biz/">
<img src="favicon.png" alt="Favicon" />
</a>

