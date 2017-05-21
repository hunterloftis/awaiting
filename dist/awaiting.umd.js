(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.awaiting = global.awaiting || {})));
}(this, (function (exports) { 'use strict';

/**
 * The async/await utility for browsers and Node.js.
 *
 * (
 * [examples](https://github.com/hunterloftis/awaiting#examples) -
 * [github](https://github.com/hunterloftis/awaiting) -
 * [npm](https://www.npmjs.com/package/awaiting) -
 * [suggestions / bug reports](https://github.com/hunterloftis/awaiting/issues) -
 * [installation](https://github.com/hunterloftis/awaiting#installation) -
 * [motivation](https://github.com/hunterloftis/awaiting#motivation)
 * )
 *
 * **`$ yarn add awaiting`**
 *
 * **`$ npm install awaiting --save`**
 *
 * **`<script src='awaiting.js'>`**
 *
 * [![Build Status](https://travis-ci.org/hunterloftis/awaiting.svg?branch=master)](https://travis-ci.org/hunterloftis/awaiting)
 * [![Coverage Status](https://coveralls.io/repos/hunterloftis/awaiting/badge.svg?branch=master)](https://coveralls.io/r/hunterloftis/awaiting?branch=master)
 *
 * @license MIT
 * @file
 * @example
 *
 * const a = require('awaiting')
 * // ...
 * await a.delay(1000)
 */

/**
 * Iterable Error type
 *
 * Functions that operate on lists throw ErrorLists,
 * making it possible to inspect all of the Errors that may have been thrown.
 *
 * @class
 * @param {string} message top-level Error message
 * @returns {iterable.<Error>}
 * @example
 *
 * const err = new ErrorList('several errors')
 * err.add(new Error('first'))
 * err.add(new Error('second'))
 * console.log(err.message, err.get(1).message)
 * // => several errors second
 *
 * @example
 *
 * try {
 *   await a.list([ failing1, failing2, failing3 ])
 * }
 * catch (errorList) {
 *   for (let err of errorList) {
 *     console.error(err.stack)
 *   }
 * }
 */
function ErrorList (message) {
  this.name = 'ErrorList';
  this.message = message;
  this.stack = (new Error()).stack;
  this.errors = [];
  Object.defineProperty(this, 'length', {
    get: function () { return this.errors.length }
  });
}
ErrorList.prototype = Object.create(Error.prototype);
ErrorList.prototype.constructor = ErrorList;
ErrorList.prototype.add = function (err) {
  this.errors.push(err);
};
ErrorList.prototype.get = function (index) {
  return this.errors[index]
};
ErrorList.prototype[Symbol.iterator] = function* () {
  let i = 0;
  while (i < this.errors.length) {
    yield this.errors[i];
    i++;
  }
};

/**
 * Waits for `ms` milliseconds to pass.
 *
 * @param {number} ms the number of milliseconds to wait
 * @returns {promise}
 * @example
 *
 * const start = Date.now()
 * await a.delay(5000)
 * console.log(Date.now() - start)
 * // => 5000
 */
async function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Waits for `date`.
 *
 * @param {date} date the date at which to stop waiting
 * @returns {promise}
 * @example
 *
 * const nextYear = new Date(2018, 1)
 * await a.time(nextYear)
 * // => this will run until the end of 2017
 */
async function time (date) {
  const delta = Math.max(date.getTime() - Date.now(), 0);
  return await delay(delta)
}

/**
 * Waits for the value of `goal`, limited by the resolution of `limiter`.
 * Throws an Error if `limiter` finishes first or if either throws early.
 * If `limiter` is a number, limits by time in milliseconds
 *
 * @param {promise} goal the promise to execute
 * @param {number|promise} limiter milliseconds or promise to limit by
 * @returns {promise}
 * @example
 *
 * // throw if flowers.jpg can't be retrieved in < 5 seconds
 * await a.limit(fetch('flowers.jpg'), 5000)
 */
async function limit (goal, limiter) {
  return new Promise((resolve, reject) => {
    const limitFn = typeof limiter === 'number'
      ? delay(limiter)
      : limiter;
    let completed = false;
    goal
      .then(result => {
        if (complete()) return
        resolve(result);
      })
      .catch(err => {
        if (complete()) return
        reject(err);
      });
    limitFn
      .then(result => {
        if (complete()) return
        reject(new Error('limit exceeded'));
      })
      .catch(err => {
        if (complete()) return
        reject(err);
      });
    function complete () {
      if (completed) return true
      completed = true;
      return false
    }
  })
}

/**
 * Waits for `emitter` to emit an `eventName` event.
 *
 * @param {EventEmitter} emitter the object to listen on
 * @param {string} eventName the event to listen for
 * @returns {promise.<Array>} an array of the arguments passed to the `eventName` event
 * @example
 *
 * await a.event(server, 'listen')
 */
async function event (emitter, eventName) {
  return new Promise((resolve, reject) => {
    emitter.once(eventName, (...args) => {
      resolve([...args]);
    });
  })
}

/**
 * Calls a function `func` that takes arguments `args` and an `(err, result)` callback.
 * Waits for the callback result, throwing an Error if err is truthy.
 *
 * @param {function} fn a function that takes a callback
 * @param {...object} args arguments to pass to `fn`
 * @returns {promise} the result passed to the callback
 * @example
 *
 * const result = await a.callback(fs.readFile, 'foo.txt')
 * console.log(result)
 * // => 'the text of the file'
 */
async function callback (fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, result) => {
      if (err) return reject(err)
      resolve(result);
    });
  })
}

/**
 * Wraps a node style function (see `callback`) into a new function, which instead of taking a callback
 * function, returns an async function (`Promise`). This `Promise` resolves if the first (error) argument of the
 * callback was called with a falsy value, rejects with the error otherwise. Takes the rest of the
 * arguments as the original function `fn`.
 *
 * @returns {function}
 * @example
 *
 * const fs = require('fs')
 * const readFile = a.awaited(fs.readFile)
 * const contents = await readFile('foo.txt', 'utf-8')
 */
function awaited (fn) {
  return async (...args) => callback(fn, ...args)
}

function throwOnRejection (err, promise) { throw err }
function swallowOnRejection (err, promise) {} // eslint-disable-line

/**
 * Waits for the first Promise in `list` to resolve.
 *
 * @param {array.<Promise>} list racing promises
 * @param {number} [ignore=0] number of rejections to ignore
 * @returns {promise}
 * @example
 *
 * const file = await a.single([ fetch(remoteFile), read(localFile) ])
 */
async function single (list, ignore = 0) {
  const results = await set(list, 1, ignore);
  return results[0]
}

/**
 * Waits for the first `count` Promises in `list` to resolve.
 *
 * @param {array.<Promise>} list racing promises
 * @param {number} [count=list.length] number of promises to wait for
 * @param {number} [ignore=0] number of rejections to ignore
 * @returns {promise.<Array>}
 * @example
 *
 * const [ first, second ] = await a.set([
 *   ping('ns1.example.com'),
 *   ping('ns2.example.com'),
 *   ping('ns3.example.com'),
 *   ping('ns4.example.com')
 * ], 2)
 * console.log(`fastest nameservers: ${first}, ${second}`)
 */

async function set (list, count = Infinity, ignore = 0) {
  return new Promise((resolve, reject) => {
    const goal = Math.min(list.length, count);
    const limit = Math.min(list.length - goal, ignore);
    const results = [];
    const failures = new ErrorList('too many failures');
    list.forEach(promise => promise.then(success).catch(error));

    function success (result) {
      if (failures.length > limit) return
      results.push(result);
      if (results.length === goal) {
        resolve(results);
      }
    }
    function error (err) {
      if (failures.length > limit) return
      if (results.length >= goal) return
      failures.add(err);
      // TODO: reject with an Iterable custom Error that includes all failures
      if (failures.length > limit) reject(failures);
    }
  })
}

/**
 * Waits for all Promises in `list` to resolve.
 *
 * Like `Promise.all` with the option to ignore some (or all) rejections.
 *
 * @param {array} list promises
 * @param {number} ignore rejections to ignore
 * @returns {promise.<Array>} promised results in order
 * @example
 *
 * const results = await a.list([ foo, bar, baz ])
 * console.log(results.length)
 * // => 3
 */
async function list (list, ignore = 0) {
  return new Promise((resolve, reject) => {
    const results = [];
    const failures = new ErrorList('too many failures');
    const complete = () => count + failures.length === list.length;
    let count = 0;
    list.forEach((promise, index) => {
      promise.then(success).catch(error);

      function success (result) {
        if (failures.length > ignore) return
        results[index] = result;
        count++;
        if (complete()) resolve(results);
      }
      function error (err) {
        if (failures.length > ignore) return
        results[index] = undefined;
        failures.add(err);
        if (failures.length > ignore) reject(failures);
        else if (complete()) resolve(results);
      }
    });
  })
}

/**
 * Waits for all Promises in the keys of `container` to resolve.
 *
 * @param {object} container
 * @param {number} ignore rejections to ignore
 * @returns {promise.<Object>} a new object with keys mapped to the resolved values
 * @example
 *
 * const results = await a.object({
 *   pictures: getPictures(),
 *   comments: getComments(),
 *   tweets: getTweets()
 * })
 * console.log(results.pictures, results.comments, results.tweets)
 */

async function object (container, ignore = 0) {
  const containsPromise = key => typeof container[key].then === 'function';
  const keys = Object.keys(container).filter(containsPromise);
  const promises = keys.map(key => container[key]);
  const results = await list(promises, ignore);
  const obj = Object.assign({}, container);
  results.forEach((result, index) => {
    const key = keys[index];
    obj[key] = result;
  });
  return obj
}

/**
 * Passes each item in `list` to the Promise-returning function `fn`,
 * running at most `concurrency` simultaneous promises.
 *
 * For cases where starting all Promises simultaneously is infeasible,
 * such as making a large number of requests to a server with rate-limiting.
 *
 * @param {array} list items to pass to each promise
 * @param {number} concurrency maximum concurrency
 * @param {function} fn takes an item and returns a Promise
 * @example
 *
 * // pull hundreds of pages from a site without getting blocked
 * const pages = await a.map(urls, 3, fetch)
 */
async function map (list, concurrency, fn) {
  return new Promise((resolve, reject) => {
    const results = [];
    let running = 0;
    let index = 0;

    update();

    function update () {
      if (index === list.length && running === 0) {
        return resolve(results)
      }
      while (running < concurrency && index < list.length) {
        fn(list[index]).then(success(index)).catch(error);
        index++;
        running++;
      }
    }
    function success (i) {
      return result => {
        running--;
        results[i] = result;
        update();
      }
    }
    function error (err) {
      running--;
      index = Infinity;
      reject(err);
    }
  })
}

/**
 * Waits for `promise` to reject, returning the Error object.
 * If `promise` resolves successfully, returns `undefined`.
 *
 * @param {promise}
 * @returns {promise.<Error>} the Error object, or undefined
 * @example
 *
 * test('throws "foo"', () => {
 *   const err = await a.failure(shouldThrow())
 *   assert.equal(err.message, 'foo')
 * })
 */
async function failure (promise) {
  return Promise.resolve()
    .then(() => promise)
    .then(() => undefined)
    .catch(err => err)
}

/**
 * Waits for the value of `promise`.
 * If `promise` throws an Error, returns `undefined`.
 *
 * @param {promise}
 * @returns {promise} the result, or undefined
 * @example
 *
 * const isNodeProject = await a.success(a.callback(fs.access, packageJSON))
 * if (isNodeProject) doSomething()
 */
async function success (promise) {
  return Promise.resolve()
    .then(() => promise)
    .catch(() => undefined) // eslint-disable-line
}

/**
 * Waits for `promise` to resolve or reject.
 * Returns either the resolved value, or the Error object.
 *
 * @param {promise}
 * @returns {promise} the result or error
 * @example
 *
 * $("#ajax-loader-animation").show()
 * await a.result(loadAjaxData())
 * $("#ajax-loader-animation").hide();
 */
async function result (promise) {
  return Promise.resolve()
    .then(() => promise)
    .catch(err => err)
}

/**
 * Provides a stack trace for unhandled rejections instead of the default message string.
 *
 * `throw` and `swallow` can be called multiple times but will only attach a single listener.
 *
 * @alias throw
 * @returns {undefined}
 * @example
 *
 * failingPromise()
 * // => (node:6051) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: fail
 *
 * @example
 *
 * a.throw()
 * failingPromise()
 * // => /Users/hloftis/code/awaiting/lib/awaiting.js:308
 * // => function throwOnRejection (err, promise) { throw err }
 * // =>                                            ^
 * // => Error: fail
 * // =>    at fail (/Users/hloftis/code/awaiting/test/fixtures/rejection-throw.js:7:9)
 * // =>    at Object.<anonymous> (/Users/hloftis/code/awaiting/test/fixtures/rejection-throw.js:4:1)
 */
function throwRejections () {
  process.removeListener('unhandledRejection', throwOnRejection);
  process.removeListener('unhandledRejection', swallowOnRejection);
  process.on('unhandledRejection', throwOnRejection);
}

/**
 * Silently swallows unhandled rejections.
 *
 * This is an anti-pattern, but if you depend on a module that doesn't handle all of its rejections,
 * you'll get a lot of really annoying logs in current versions of node.
 * `swallow` will allow you to suppress them.
 *
 * `throw` and `swallow` can be called multiple times but will only attach a single listener.
 *
 * @alias swallow
 * @returns {undefined}
 * @example
 *
 * failingPromise()
 * // => (node:6051) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): Error: fail
 *
 * @example
 *
 * a.swallow()
 * failingPromise()
 * // (no output)
 */
function swallowRejections () {
  process.removeListener('unhandledRejection', throwOnRejection);
  process.removeListener('unhandledRejection', swallowOnRejection);
  process.on('unhandledRejection', swallowOnRejection);
}

exports.delay = delay;
exports.time = time;
exports.limit = limit;
exports.event = event;
exports.callback = callback;
exports.single = single;
exports.set = set;
exports.list = list;
exports.object = object;
exports.map = map;
exports.failure = failure;
exports.success = success;
exports.result = result;
exports.awaited = awaited;
exports.awaitable = awaited;
exports.throw = throwRejections;
exports.swallow = swallowRejections;
exports.ErrorList = ErrorList;

Object.defineProperty(exports, '__esModule', { value: true });

})));
