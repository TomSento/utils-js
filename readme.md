# utilizer-js

[![Join the chat at https://gitter.im/tomas-sentkeresty/utilizer-js](https://badges.gitter.im/tomas-sentkeresty/utilizer-js.svg)](https://gitter.im/tomas-sentkeresty/utilizer-js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

>*Still experimental and unstable*

Storage for custom JavaScript utility functions.

## FEATURES

- Organize your utils in multiple files.
- Compile utils to single object, where each utility is single line of code:

```javascript
var U = {
    // META START
    v: '1.0.0',
    utilsVersion: '1.2.0',
    // META END
    // INTERNALS START
    // INTERNALS GOES HERE...
    // INTERNALS END
    // MY UTILS START
    // MY UTILS GOES HERE...
    myUtil1(a,b): function(){}, // (function|string|number|object|date)
    // MY UTILS GOES HERE...
    // MY UTILS END
}
```

Compiler writes output to `utils.min.js` file.

## PROS
**Lightweight**
- Compile only what you need.

**Multipurpose**
- Private scope usage: for standalone module or library.
- Global scope usage: for business project.
- Plays well with both **browser** and **node** enviroment.

**Flexible**
- Just remove files from utils and code your custom utils. :)

**Functional**
- No need to reinvent standard functionality always from scratch.

**Out of a box solution**
- Comes with precoded utilities like **schemas**, **errors**, **dom** and a lot more.

**Safe**
- Can solve browser backward compatibility.

**Managable**
- Saves target's project lines of code.
- Compiled result is very well readable API reference.
- Usage of utils makes target project more readable.
- Track `module version` and `utils version` separately.

**Fast**
- Brutal fast compilation.

## CONS
- Required compile step.
- Utils structure must be flat *(readability is on 1st place by design)*.
- Manual compilation.
- Manual pasting utils to target project.

## TIPS
- Keep utils structure flat.
- Avoid creating objects to wrap your utils.
- Use build in `malloc` cache or custom cache implementation to store data. This makes data available inside function body even when function is called multiple times.
- Build in `malloc` cache uses prefix to specify utilities group. e.g see `utils/browser/dom.js`.

## COMPILE
Compile all utility functions:
```bash
node compile
```
**ENV variables**
- `KEYS=` - List of comma separated keys - which utils to compile.

**Custom ENV variables**
- `v=` - `x.x.x` Version of your module, library, project or whatever.
> **Tip:** You can define custom ENV variables to set other meta properties.

### CORE SET
If you use included utils this is total minimum which must be always compiled:
```bash
v=1.2.3 KEYS=v,utilsVersion,utilsCompileCMD,__cache,malloc,toDebugStr,logDebug,logWarn,log node compile
```

### BASE SET
To compile more utilities append more util keys:
> Order must be preserved.
##### \+ ERRORS *(OPTIONAL)*
```
...,error,ErrorBuilder
```
##### \+ SCHEMAS *(OPTIONAL)*
```
...,Schema
```
##### \+ PRIMITIVE UTILS *(OPTIONAL)*
##### \+ BROWSER UTILS *(OPTIONAL)*

#### EXAMPLE
```bash
v=1.2.3 KEYS=v,utilsVersion,utilsCompileCMD,__cache,malloc,toDebugStr,logDebug,logWarn,log,error,ErrorBuilder,Schema node compile
```

### NOTES
> - Value assigned to key can be `any` type.  
> - Only place where `object` is allowed is in `utils/_internal.js` file, used for common cache for all utilities.
> - Values with type `string|number|date` can occur in `utils/meta.js`.
> - Other than that you should always assign `function`.
