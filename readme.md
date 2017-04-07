# Awaiting

The async/await utility for browsers and Node.js.

[Docs](api.md)

## Examples

```js
// wait for a second
await a.delay(1000)

// limit a fetch to five seconds
const image = await a.limit(fetch('flowers.jpg'), 5000)

// await events
await a.event(server, 'listen')

// await callbacks
const contents = await a.callback(fs.readFile, 'foo.txt')

// map an array to an async function with 3 instances running in parallel
const pages = await a.map(urls, 3, async url => await fetch(url))

// await successes (ignoring errors)
const optionalFeature = await a.resolution(optionalStep)
```

...and more in [the docs](api.md).

## Installation

### In node

Use yarn or npm:

```
$ yarn add awaiting

$ npm install --save awaiting
```

*then:*

```js
const a = require('awaiting')
await a.delay(1000)
```

### In a browser

Use [https://raw.githubusercontent.com/hunterloftis/awaiting/master/browser/awaiting.js](browser/awaiting.js):

```html
<script src='awaiting.js'></script>
<script>
  const a = awaiting
  await a.delay(1000)
</script>
```

## Building

```
$ yarn build
```

## Testing

```
$ yarn install
$ yarn test
$ yarn test:browser
```
