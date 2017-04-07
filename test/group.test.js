const a = require('..')
const assert = require('chai').assert

describe('group', () => {
  it('returns the results of all promises', async () => {
    const results = await a.group([ p('foo'), p('bar'), p('baz') ])
    assert.deepEqual(results, ['foo', 'bar', 'baz'])
  })
  it('throws if one of the first `count` results throws', async () => {
    try {
      const results = await a.group([ p('foo', 100), f(50), p('baz', 10)])
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'fail')
    }
  })
})

function p(val, delay = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(val), delay)
  })
}

async function f(delay) {
  await a.delay(delay)
  throw new Error('fail')
}
