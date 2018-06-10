# Utilizer.js

> :small_orange_diamond: *experimental & unstable*

**Utilizer.js** is collection of standalone JavaScript utilities

 - Included are utilities for **browser** and **Node.js** environment, e.g. **schemas**, **errors**, **dom**,...
 - See [full build](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/dist/utils.git.js) for complete list of available utilities
 - See [./utils](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/utils) for their implementations

## Compile

Compile all utilities
```bash
node compile
```

Compile by keys
```bash
v=1.6.0 keys=malloc,toDebugStr,logPrefix,log,logDebug,logWarn,logError,Error,ErrorBuilder,SETSCHEMA,SCHEMA node compile
```

> **Utilizer.js** uses [Atomizer.js](https://github.com/atomizerjs/atomizerjs) - very simple one line per utility minifier

`node compile` creates at once **partial build** and [full build](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/dist/utils.git.js) under [./dist](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/dist)

**ENV variables**
- `v=` - *optional* - Must match with [package.json](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/package.json) version
- `keys=` - *optional* - Comma separated utility names. Order is not critical. Build is always ordered correctly, as defined in [./compile.js](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/compile.js)

## Tips
- You can use built-in `malloc cache`, e.g. [./utils/browser/dom.js](https://github.com/tomas-sentkeresty/utilizerjs/blob/master/utils/browser/dom.js)
