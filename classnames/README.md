# Classnames

```js
import classnames from "...macro";

import * as styles from "...style.module.css";

const className = classnames("bg-white rounded", styles.card);
```

will be transpiled to this

```js
import * as styles from "...style.module.css";

const className = "bg-white rounded " + styles.card;
```
