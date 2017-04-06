# Awaiting

The async/await utility for browsers and Node.js.

**Just getting this set up / published / documented now. Should be usable in about 24 hours.**

[Docs](api.md)

## Examples

```js
// wait for a second
await a.delay(1000)

// limit a fetch to five seconds
const image = await a.limit(fetch('flowers.jpg', 5000)

// await events
await a.event(server, 'listen')

// await callbacks
const contents = await a.callback(fs.readFile, 'foo.txt')

// run a series of async functions
const results = await a.series([foo, bar, baz])

// map an array to an async function with a concurrency of 3
const pages = await a.map(urls, 3, async url => await fetch(url))

// await successes (ignoring errors)
const success = await a.resolution(optionalStep)

// await errors (ignoring successes)
const err = await a.rejection(shouldFail)
```

...and more in [the docs](api.md).

## Installation

### Browser

```html
<script src='awaiting.js'></script>
<script>
  const a = awaiting()
  await a.delay(1000)
</script>
```

### Node.js

```
$ yarn add awaiting
```

*or*

```
$ npm install --save awaiting
```

*then*

```js
const a = require('awaiting')
await a.delay(1000)
```

## Testing

```
$ yarn test
```
