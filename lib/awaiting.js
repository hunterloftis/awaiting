module.exports = {
  delay,
  time,
  limited,
  event,
  callback,
  set,
  series,
  throttle,
  race,
  rejection,
  resolution,
  result
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
function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Waits for `date`.
 */
function time (date) {

}

/**
 * Runs both `goal` and `limit` and waits for the value of `goal`.
 * If `limit` finishes first, throws an Error.
 */
function limited (goal, limit) {

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
function throttle (list, concurrency) {

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
