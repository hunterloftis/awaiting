# Awaiting

The async/await utility for browsers and Node.js.

[API Docs](https://hunterloftis.github.io/awaiting) |
[Installation](#installation) |
[Examples](#examples) |
[Motivation](#motivation) |
[API Overview](#api-overview)

- Node.js >= 7.6.0
- Edge >= 15
- Firefox >= 52
- Chrome >= 55
- Safari >= 10.1
- Opera >= 44
- iOS Safari >= 10.3

[![Build Status](https://travis-ci.org/hunterloftis/awaiting.svg?branch=master)](https://travis-ci.org/hunterloftis/awaiting)
[![Coverage Status](https://coveralls.io/repos/hunterloftis/awaiting/badge.svg?branch=master)](https://coveralls.io/r/hunterloftis/awaiting?branch=master)

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

main()

async function main() {
  await a.delay(1000)
}
```

### In a browser

Use [dist/awaiting.umd.js](https://raw.githubusercontent.com/hunterloftis/awaiting/master/dist/awaiting.umd.js):

```html
<script src='awaiting.js'></script>
<script>
  const a = awaiting

  main()

  async function main() {
    await a.delay(1000)
  }
</script>
```

### With Babel

`import` whatever you want, you hipster.

## Examples

Check out a
[live example in your browser](https://hunterloftis.github.io/awaiting/examples/kittens.html),
then [view the source](examples/kittens.html).

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
const pages = await a.map(urls, 3, fetch)

// await successes (ignoring errors)
const file = await a.success(getNetworkFile())
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
Await, combined with these simple abstractions, yields readable yet powerful async workflows.

**Why now?**
Node v7.6.0 enabled non-transpiled, non-flagged, out-of-the-box support for async functions.
Every major browser has shipped support.
If you write for old clients, you can still use this via Babel.
Async functions are already here.

**Why not something like Bluebird?**
This is heavily inspired by libraries like
[Bluebird](http://bluebirdjs.com/docs/getting-started.html)
and [Async](https://github.com/caolan/async),
which both aim to make non-trivial async workflows more readable.

However, these problems shouldn't be solved by replacing native Promise implementations with custom versions,
as Bluebird and Q attempt.
Having multiple, conflicting definitions of Promise in a codebase means you now have to check
the capabilities of a given Promise before using it.
This decreases interoperability and increases fragmentation - and dependency bloat.
It's not uncommon for a single app to depend on two or three subtly different Promise implementations.

We've been here before, back when extending Object prototypes was the norm.
We've seen how painful it is to have different libraries extending or replacing
built-ins like Promise with conflicting implementations of custom behavior.

Node's ['unhandledRejection' event](https://nodejs.org/api/process.html#process_event_unhandledrejection)
illustrates why interoperability is so important:
if you're using non-standard Promises, you can't catch that event.
If your app and dependencies use a *mix* of 3rd party and native Promises,
*some* of the Promise rejections in your app will be caught while others are not.
If you've ever used a library that returned some sort of "Promise,"
but you had to dive into the source to find out exactly which implementation and custom behavior it exposed,
you've also experienced the pain of fragmentation.

Instead, awaiting follows the example of
[lodash](https://lodash.com/) and
[underscore](http://underscorejs.org/),
which chose not to replace or extend native Arrays and Objects, but instead provided functional utilities for them.

## API Overview

This illustrates use cases for each utility.
For details, see the [full API docs](https://hunterloftis.github.io/awaiting/).

Use this when you want to...

- **callback:** treat a callback function (like one of the core node APIs) as an async function.
- **delay:** wait for some time to pass.
- **event:** treat an EventEmitter's event (like `server.on('listen')`) as an async function.
- **failure:** inspect the Error from a probable failure (vs throwing / exiting)
- **limit:** limit the runtime of an async function so your program doesn't hang.
- **list:** wait for a list of async functions to resolve simultaneously, possibly ignoring some number of rejections.
- **map:** wait for a list of async functions to resolve, limiting how many run simultaneously to avoid running out of memory or hammering a server with too many requests.
- **object:** resolve several async functions simultaneously which are stored as properties of an object.
- **result:** wait for an async function to resolve or reject, then check to see whether it returned a result or an Error.
- **set:** wait for a minimum set of async functions to resolve, such as pinging a dozen servers and seeing which two are fastest.
- **single:** wait for a single async function to resolve from a list.
- **success:** ignore the result of an async function (`undefined`) if it fails.
- **swallow:** use someone else's module that throws a lot of unhandled rejection errors.
- **throw:** get useful stack traces from your unhandled rejections instead of just console logs.
- **time:** wait for a specific time (as a `Date` object).

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
