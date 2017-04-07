# Awaiting

The async/await utility for browsers and Node.js.

[API Docs](https://hunterloftis.github.io/awaiting) |
[Installation](#installation) |
[Examples](#examples) |
[Motivation](#motivation)

- Node.js >= 0.7.6
- Edge >= 15
- Firefox >= 52
- Chrome >= 55
- Safari >= 10.1
- Opera >= 44
- iOS Safari >= 10.3

[![Build Status](https://travis-ci.org/hunterloftis/awaiting.svg?branch=master)](https://travis-ci.org/hunterloftis/awaiting)

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

...and more in [the API Docs](https://hunterloftis.github.io/awaiting).

## Motivation

**I love the async/await pattern.**
Code written with async functions benefits from superior readability,
improved terseness and expressiveness, and unified error handling.
No more nested callbacks, opaque Promise chains, and `if (err)` checks littering your code.

**However, this pattern isn't a panacea.**
It's easy to do some things:
iterate through single items, wait on a single result, run an array of promises in parallel.
Other workflows require abstraction or state.
I kept finding myself writing the same utility functions in each project:
delays, throttled maps, skipping try/catch on optional operations, adapting to events or callbacks.
Await, combined with simple abstractions, yields readable yet powerful async workflows.

**Why now?**
Node v7.6.0 enabled non-transpiled, non-flagged, out-of-the-box support for async functions.
Every major browser has shipped support.
If you write for old clients, you can still use this via Babel.
Async functions are already here.

**Why not something like Bluebird?**
Check your `node_modules` directories - how many different Promise libs do your projects have
in addition to the to-spec one that ships with node?
3rd party Promises mean that you now have to check the capabilities of a given Promise before using it.
What's the word for that? Fragmentation.

We've been here before, back when extending Object prototypes was cool; let's not regress.
Instead, we should follow the example of lodash/underscore:
JavaScript needed better Array and Object functions -
not a 3rd party lib that replaced Array or Object with custom versions, or extended their prototypes with methods.

Node's ['unhandledRejection' event](https://nodejs.org/api/process.html#process_event_unhandledrejection)
illustrates these interoperability issues:
if you're using non-standard Promises, they won't be catchable.
If your app and dependencies use a *mix* of 3rd party and native Promises,
*some* of the Promise rejections in your app will be caught while others are not.

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
