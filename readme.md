# Cor.js

**Requirements:** Node.js +v10.0.0  
> Not yet production ready

## Docs

Primitives|
-|
[Array.prototype.find(fn, v?) : Any](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/array/Array.prototype.find.js) `override`|
[Array.prototype.findIndex(fn, v?) : Number](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/array/Array.prototype.findIndex.js) `override`|
[Array.prototype.remove(fn, v?) : Array](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/array/Array.prototype.remove.js)|
[Array.prototype.unique(k?) : Array](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/array/Array.prototype.unique.js)|
[Cor.clone(obj, skip?, skipFunctions?) : Object](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/object/Cor.clone.js)|
[Cor.extend(objA, objB, rewrite?) : Object](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/object/Cor.extend.js)|
[String.prototype.escape() : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.escape.js)|
[String.prototype.fmt(...Any) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.fmt.js)|
[String.prototype.padEnd(len, str?) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.padEnd.js) `polyfill`|
[String.prototype.padStart(len, str?) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.padStart.js) `polyfill`|
[String.prototype.slug(max?) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.slug.js)|
[String.prototype.strip() : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/1_primitives/string/String.prototype.strip.js)|


Core|
-|
[Cor.all(arr, fn, next?) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.all.js)|
[Cor.extension(k?) : String?](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.extension.js)|
[Cor.html](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.html.js) `literal tag`|
[Cor.Schema(obj) : Schema](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.Schema.js) `class`|
[Cor.tid() : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.tid.js)|
[Cor.uid(len) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.uid.js)|
[Cor.userAgent(str?) : Object](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/Cor.userAgent.js)|
[log(...Any) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/2_core/log.js) `global`|


Node|
-|
[Cor.handleRequest(req, res, routeError) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/server/Cor.handleRequest.js)|
[Cor.request(url, flags, a, b?, c?) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/server/Cor.request.js)|
[Cor.route(matcher, ...middlewares, fn) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/server/Cor.route.js)|
[Cor.buildTmp(fn?) : undefined](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/Cor.buildTmp.js)|
[Cor.compileSrc(str?) : String](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/Cor.compileSrc.js)|
[Cor.loadComponents(obj) : { component, header, footer }](https://github.com/tomassentkeresty/corjs/blob/master/utils/3_node/Cor.loadComponents.js)|


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
