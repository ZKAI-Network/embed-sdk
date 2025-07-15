# How to work in this library

## Use namespace imports!

Instead of importing `import { Effect } from "effect"` as named imports.

You need to import using a namespace import like:
```
import * as Effect from "effect/Effect"
```

As otherwise we don't get tree shaking, which refers to a process that eliminates unused code during the bundling of your application. Named imports may generate tree shaking issues when a bundler doesn’t support deep scope analysis.

Make sure in every package we use namespace imports!
