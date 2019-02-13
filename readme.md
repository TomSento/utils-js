# Cor.js

> not yet production ready

## Requirements

- Node.js +v10.0.0

## Build

```bash
node min -m
```

## Docs

Internals|
-
[malloc(scope) : Function]() `global`|
[typ : Object.prototype.toString]() `global`|


Primitives|
-
[array.find(fn, v?) : Any]() `override`|
[array.findIndex(fn, v?) : Number]() `override`|
[array.remove(fn, v?) : Array]()|
[array.unique(k?) : Array]()|
[Cor.clone(obj, skip?, skipFunctions?) : Object]()|
[Cor.extend(objA, objB, rewrite?) : Object]()|
[Cor.extension(k?) : String?]()|
[string.escape(lspace?, lrev?, rspace?) : String]()|
[string.fmt(...String) : String]()|
[string.padEnd(len, str?) : String]() `polyfill`|
[string.padStart(len, str?) : String]() `polyfill`|
[string.slug(max?) : String]()|
[string.strip() : String]()|

## Contact

Tomáš Sentkeresty - [tsentkeresty@gmail.com](mailto:tsentkeresty@gmail.com)
