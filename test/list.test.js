const a = require('..')
const assert = require('chai').assert

describe('list', () => {
  it('returns the results of all promises', async () => {
    const results = await a.list([ p('foo'), p('bar'), p('baz') ])
    assert.deepEqual(results, ['foo', 'bar', 'baz'])
  })
  it('throws if one of the results throws', async () => {
    try {
      const results = await a.list([ f(120), p('foo', 100), f(50), p('baz', 10)])
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
      assert.equal(err.get(0).message, 'fail')
    }
  })
  it("doesn't throw if failures < ignore", async () => {
    const results = await a.list([ p('foo', 100), f(50), p('baz', 10)], 1)
    assert.deepEqual(results, ['foo', undefined, 'baz'])
  })
  it('resolves if an error is the last promise to complete', async () => {
    const results = await a.list([ f(100), p('bar', 50), p('baz', 10)], 1)
    assert.deepEqual(results, [undefined, 'bar', 'baz'])
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
