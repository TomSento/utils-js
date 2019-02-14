# Cor.js

**Requirements:** Node.js +v10.0.0  
> Not yet production ready

## Docs

Primitives|
-|
[array.find(fn, v?) : Any](#docs) `override`|
[array.findIndex(fn, v?) : Number](#docs) `override`|
[array.remove(fn, v?) : Array](#docs)|
[array.unique(k?) : Array](#docs)|
[Cor.clone(obj, skip?, skipFunctions?) : Object](#docs)|
[Cor.extend(objA, objB, rewrite?) : Object](#docs)|
[string.escape() : String](#docs)|
[string.padEnd(len, str?) : String](#docs) `polyfill`|
[string.padStart(len, str?) : String](#docs) `polyfill`|
[string.slug(max?) : String](#docs)|
[string.strip() : String](#docs)|


Core|
-|
[Cor.all(arr, fn, next?) : undefined](#docs)|
[Cor.extension(k?) : String?](#docs)|
[Cor.h(cmd, a?, b?) : String](#docs)|
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
[Cor.compileSrc(str?) : String](#docs)|


Browser|
-|
[Cookie.get(k) : String?](#docs) `global`|
[Cor.visible(el) : Boolean](#docs)|
[Cor.xhr(cmd, a, b?, c?, d?) : undefined](#docs)|
[CustomEvent.create(k, v?) : CustomEvent](#docs)|
[element.matches(sel) : Boolean](#docs) `polyfill`|
[element.removeChild(el) : Element](#docs) `override`|
[HTMLCollection.from(str?) : HTMLCollection](#docs)|


## Contact

Tomáš Sentkeresty - [tsentkeresty@gmail.com](mailto:tsentkeresty@gmail.com)
