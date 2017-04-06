module.exports = {
  delay,
  time,
  limit,
  event,
  callback,
  set,
  series,
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
 * @category Time
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
 * @category Time
 * @param {date} date the date-time at which to stop waiting
 * @returns {promise}
 * @example
 *
 * const end = Date.now() + 1000
 * await time(end)
 * console.log('One second later')
 */
async function time (date) {
  const delta = Math.max(date - Date.now(), 0)
  return await delay(delta)
}

/**
 * Waits for the value of `goal`, limited by the resolution of `limiter`.
 * Throws an Error if `limiter` finishes first or if either throws early.
 * If `limiter` is a number, limits by time in milliseconds
 *
 * @category Time
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
 */
function event (emitter, eventName) {

}

/**
 * Calls a function `func` that takes arguments `args` and an (err, result) callback.
 * Waits for the callback result, throwing an Error if err is truthy.
 */
function callback (func, ...args) {

}

/**
 * Waits for `count` Promises in `list` to resolve (all, by default).
 * Throws an Error if anything in `list` rejects.
 * Returns an Array of each result in `list`.
 */
function set (list, count) {

}

/**
 * Waits for each Promise in `list` sequentially,
 * throwing an Error if any rejects.
 * Once complete, returns an Array of each result.
 */
function series (list) {

}

/**
 * Resolves each Promise in `list`,
 * running at most `concurrency` items in parallel.
 * Throws an Error if anything in `list` rejects.
 * Returns Array of each result in `list`
 */
function map (list, concurrency, fn) {

}

/**
 * Waits for the first Promise in `list` to resolve.
 * Throws an Error if anything in `list` rejects.
 */
function race (list) {

}

/**
 * Waits for `promise` to reject, returning the Error object.
 * If `promise` resolves successfully, returns `undefined`.
 */
function rejection (promise) {

}

/**
 * Waits for the value of `promise`.
 * If `promise` throws an Error, returns `undefined`.
 */
function resolution (promise) {

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
