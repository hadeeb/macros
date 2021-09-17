# Inline constants

```js
// env.macro.js
const createConstantMacro = require(".../this/macro");

module.exports = createConstantMacro({ BUILD_TIME: Date.now() });

// somefile.js
import { BUILD_TIME } from ".../path/to/env.macro";

console.log(`Built at ${new Date(BUILD_TIME)}`);
```

## Related

- [`preval.macro`](https://github.com/kentcdodds/preval.macro)
