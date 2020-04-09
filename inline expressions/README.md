# Inline expressions

```js
// env.macro.js
const createExpressionMacro = require(".../this/macro");

module.exports = createExpressionMacro({
  isDevelopment: '"production" !== process.env.NODE_ENV',
  isBrowser: '"undefined" !== typeof window',
});

// somefile.js
import { isDevelopment } from "...env.macro.js";

if (isDevelopment) {
  console.error(error);
} else {
  ErrorTracker.report(error);
}
```

## Related

- [`preval.macro`](https://github.com/kentcdodds/preval.macro)
