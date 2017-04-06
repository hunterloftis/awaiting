# Awaiting

The async/await utility for browsers and Node.js.

[Docs](api.md)

## Examples

```js
// await times...
await a.delay(1000)
const image = await a.limit(fetch('flowers.jpg', 5000)

// await callbacks and events...
await a.event(server, 'listen')
const contents = await a.callback(fs.readFile, 'foo.txt')

// await lists...
const results = await a.series([foo, bar, baz])
const pages = await a.map(urls, 3, async url => await fetch(url))

// await successes or errors...
const err = await a.rejection(shouldFail)
const success = await a.result(optionalStep)
```

See all options in [the docs](api.md).

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
