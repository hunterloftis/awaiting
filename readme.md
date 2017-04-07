# Awaiting

The async/await utility for browsers and Node.js.

[API Docs](https://hunterloftis.github.io/awaiting/api.html) | [Examples](#examples) | [Installation](#installation) | [GitHub](https://github.com/hunterloftis/awaiting)

- Node.js >= 0.7.6
- Edge >= 15
- Firefox >= 52
- Chrome >= 55
- Safari >= 10.1
- Opera >= 44
- iOS Safari >= 10.3

[![Build Status](https://travis-ci.org/hunterloftis/awaiting.svg?branch=master)](https://travis-ci.org/hunterloftis/awaiting)

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

...and more in [the API Docs](https://hunterloftis.github.io/awaiting/api.html).

## Installation

### In node

Use yarn or npm:

```
$ yarn add awaiting
```
```
$ npm install --save awaiting
```

*then:*

```js
const a = require('awaiting')
await a.delay(1000)
```

### In a browser

Use [browser/awaiting.js](https://raw.githubusercontent.com/hunterloftis/awaiting/master/browser/awaiting.js):

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
