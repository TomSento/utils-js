# Utilizer.js

> :small_orange_diamond: *experimental & unstable*

**Compile utilities to single object, one utility per line**

```javascript
// keys=myUtil1 node compile
var U = {};
U.myUtil1(a,b) = function(){};U.myUtil1.prototype={}; // (function|string|number|object|date)
```

- Supports partial build with version checking and check if function is implemented or not
- Builds `partial` and [full build](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/dist/utils.git.js) under [./dist](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/dist) at same moment
- Supports function `prototyping`
- Plays well with both **browser** and **node** enviroment
- Comes with precoded **schemas**, **errors**, **dom**, etc.
- Can solve browser compatibility issues
- Build is well readable API reference
- You can always remove files from [./utils](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/utils) and code your own :zap:

## COMPILE

Compile all utilities
```bash
node compile
```

Compile by keys
```bash
v=1.6.0 keys=malloc,toDebugStr,logPrefix,log,logDebug,logWarn,logError,Error,ErrorBuilder,SETSCHEMA,SCHEMA node compile
```

**ENV variables**
- `v=` - *optional* - Must match with [package.json](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/package.json) version
- `keys=` - *optional* - Comma separated utility names. Order is not critical. Build is always ordered correctly, as defined in [./compile.js](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/compile.js)

## TIPS
- You can use built-in `malloc cache`, e.g. [./utils/browser/dom.js](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/utils/browser/dom.js)
