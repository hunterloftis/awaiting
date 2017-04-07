module.exports = {
  delay,
  time,
  limit,
  event,
  callback,
  group,
  map,
  race,
  rejection,
  resolution,
  result,
  unhandled
}

/**
 * Waits for `ms` milliseconds to pass.
 *
 * @param {number} ms the number of milliseconds to wait
 * @returns {promise}
 * @example
 *
 * const start = Date.now()
 * await delay(5000)
 * console.log(Date.now() - start)
 * // => 5000
 */
async function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Waits for `date`.
 *
 * @param {date} date the date at which to stop waiting
 * @returns {promise}
 * @example
 *
 * const nextYear = new Date(2018, 1)
 * await time(nextYear)
 * // => this will run until the end of 2017
 */
async function time (date) {
  const delta = Math.max(date.getTime() - Date.now(), 0)
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
 * await limit(fetch('flowers.jpg'), 5000)
 */
async function limit (goal, limiter) {
  return new Promise((resolve, reject) => {
    const limitFn = typeof limiter === 'number'
      ? delay(limiter)
      : limiter
    let completed = false
    goal
      .then(result => {
        if (complete()) return
        resolve(result)
      })
      .catch(err => {
        if (complete()) return
        reject(err)
      })
    limitFn
      .then(result => {
        if (complete()) return
        reject(new Error('limit exceeded'))
      })
      .catch(err => {
        if (complete()) return
        reject(err)
      })
    function complete () {
      if (completed) return true
      completed = true
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
      resolve([...args])
    })
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
      resolve(result)
    })
  })
}

/**
 * Waits for all Promises in `list` to resolve.
 * Throws an Error if anything in `list` rejects.
 *
 * @param {array} list promises
 * @returns {array} promised results in order
 * @example
 *
 * const results = await a.group([ foo, bar, baz ])
 * console.log(results.length)
 * // => 3
 */
async function group (list) {
  return Promise.all(list)
}

/**
 * Passes each item in `list` to the Promise-returning function `fn`,
 * running at most `concurrency` simultaneous promises.
 * Throws an Error if any promise rejects.
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
    const results = []
    let running = 0
    let index = 0

    update()

    function update () {
      if (index === list.length && running === 0) {
        return resolve(results)
      }
      while (running < concurrency && index < list.length) {
        fn(list[index]).then(success(index)).catch(error)
        index++
        running++
      }
    }
    function success (i) {
      return result => {
        running--
        results[i] = result
        update()
      }
    }
    function error (err) {
      running--
      index = Infinity
      reject(err)
    }
  })
}

/**
 * Waits for the first Promise in `list` to resolve.
 * Throws an Error if anything in `list` rejects.
 *
 * @param {array.<Promise>} list racing promises
 * @returns {promise}
 * @example
 *
 * const file = await a.race(fetch(remoteFile), read(localFile))
 */
async function race (list) {
  return new Promise((resolve, reject) => {
    let winner = false
    list.forEach(promise => promise.then(success).catch(error))

    function success (result) {
      if (winner) return
      winner = true
      resolve(result)
    }
    function error (err) {
      if (winner) return
      winner = true
      reject(err)
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
 * const err = await a.rejection(shouldFail())
 */
async function rejection (promise) {
  return new Promise((resolve, reject) => {
    promise.then(() => resolve(undefined)).catch(resolve)
  })
}

/**
 * Waits for the value of `promise`.
 * If `promise` throws an Error, returns `undefined`.
 *
 * @param {promise}
 * @returns {promise} the result, or undefined
 * @example
 *
 * const result = await a.resolution(optionalStep())
 */
function resolution (promise) {
  return new Promise((resolve, reject) => {
    promise.then(resolve).catch(err => resolve(undefined)) // eslint-disable-line
  })
}

/**
 * Waits for `promise` to resolve or reject.
 * Returns either the resolved value, or the Error object.
 */
function result (promise) {

}

/**
 * Handles 'unhandledRejection' events.
 * Provides a stack trace of Error objects in addition to the default message string.
 * If `silent` is truthy, silently swallows unhandled Promise errors.
 * Idempotent; can be called multiple times but will only attach a single listener.
 */
function unhandled (silent) {

}
