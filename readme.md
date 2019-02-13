# Cor.js

**Requirements:** Node.js +v10.0.0  
> Not yet production ready

## Docs

Internals|
-|
[malloc(scope) : Function]() `global`|
[typ : Object.prototype.toString]() `global`|


Primitives|
-|
[array.find(fn, v?) : Any]() `override`|
[array.findIndex(fn, v?) : Number]() `override`|
[array.remove(fn, v?) : Array]()|
[array.unique(k?) : Array]()|
[Cor.clone(obj, skip?, skipFunctions?) : Object]()|
[Cor.extend(objA, objB, rewrite?) : Object]()|
[Cor.extension(k?) : String?]()|
[string.escape(lspace?, lrev?, rspace?) : String]()|
[string.padEnd(len, str?) : String]() `polyfill`|
[string.padStart(len, str?) : String]() `polyfill`|
[string.slug(max?) : String]()|
[string.strip() : String]()|


Core|
-|
[Cor.all(arr, fn, next?) : undefined]()|
[Cor.h(cmd, a?, b?) : String]()|
[Cor.Schema(obj) : Schema]() `class`|
[Cor.test(k, fn, maxTimeout?) : undefined]()|
[Cor.uid1() : String]()|
[Cor.uid2() : String]()|
[Cor.userAgent(str?) : Object]()|
[log(...Any) : undefined]() `global`|


Node|
-|
[Cor.handleRequest(req, res, routeError) : undefined]()|
[Cor.request(url, flags, a, b?, c?) : undefined]()|
[Cor.route(matcher, ...middlewares, fn) : undefined]()|
[Cor.compileSrc(str?) : String]()|


Browser|
-|
[Cookie.get(k) : String?]() `global`|
[Cor.visible(el) : Boolean]()|
[Cor.xhr(cmd, a, b?, c?, d?) : undefined]()|
[CustomEvent.create(k, v?) : CustomEvent]()|
[Element.prototype.matches(sel) : Boolean]() `polyfill`|
[Element.prototype.removeChild(el) : Element]() `override`|
[HTMLCollection.from(str?) : HTMLCollection]()|


## Contact

Tomáš Sentkeresty - [tsentkeresty@gmail.com](mailto:tsentkeresty@gmail.com)
