# Cor.js

**Requirements:** Node.js +v10.0.0  
> Not yet production ready

## Docs

Primitives|
-|
[Array.prototype.find(fn, v?) : Any](#docs) `override`|
[Array.prototype.findIndex(fn, v?) : Number](#docs) `override`|
[Array.prototype.remove(fn, v?) : Array](#docs)|
[Array.prototype.unique(k?) : Array](#docs)|
[Cor.clone(obj, skip?, skipFunctions?) : Object](#docs)|
[Cor.extend(objA, objB, rewrite?) : Object](#docs)|
[String.prototype.escape() : String](#docs)|
[String.prototype.fmt(...Any) : String](#docs)|
[String.prototype.padEnd(len, str?) : String](#docs) `polyfill`|
[String.prototype.padStart(len, str?) : String](#docs) `polyfill`|
[String.prototype.slug(max?) : String](#docs)|
[String.prototype.strip() : String](#docs)|


Core|
-|
[Cor.all(arr, fn, next?) : undefined](#docs)|
[Cor.extension(k?) : String?](#docs)|
[Cor.html](#docs) `literal tag`|
[Cor.Schema(obj) : Schema](#docs) `class`|
[Cor.tid() : String](#docs)|
[Cor.uid(len) : String](#docs)|
[Cor.userAgent(str?) : Object](#docs)|
[log(...Any) : undefined](#docs) `global`|


Node|
-|
[Cor.handleRequest(req, res, routeError) : undefined](#docs)|
[Cor.request(url, flags, a, b?, c?) : undefined](#docs)|
[Cor.route(matcher, ...middlewares, fn) : undefined](#docs)|
[Cor.buildTmp(fn?) : undefined](#docs)|
[Cor.compileSrc(str?) : String](#docs)|
[Cor.loadComponents(obj) : { component, header, footer }](#docs)|


Browser|
-|
[Cookie.get(k) : String?](#docs) `global`|
[Cor.visible(el) : Boolean](#docs)|
[Cor.xhr(cmd, a, b?, c?, d?) : undefined](#docs)|
[CustomEvent.create(k, v?) : CustomEvent](#docs)|
[Element.prototype.matches(sel) : Boolean](#docs) `polyfill`|
[Element.prototype.removeChild(el) : Element](#docs) `override`|
[Element.state : Object \| Array](#docs) `attribute`|
[HTMLCollection.from(str?) : HTMLCollection](#docs)|
[HTMLCollection.prototype.forEach(fn, ctx?) : undefined](#docs)|


## Contact

Tomáš Sentkeresty - [tsentkeresty@gmail.com](mailto:tsentkeresty@gmail.com)
