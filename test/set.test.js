const a = require('..')
const assert = require('chai').assert

describe('set', () => {
  it('returns the results of all promises in resolution order', async () => {
    const results = await a.set([ p('foo', 100), p('bar', 50), p('baz', 10) ])
    assert.deepEqual(results, ['baz', 'bar', 'foo'])
  })
  it('returns `count` results', async () => {
    const results = await a.set([ p('foo', 100), p('bar', 50), p('baz', 10) ], 2)
    assert.deepEqual(results, ['baz', 'bar'])
  })
  it('throws if one of the first `count` results throws', async () => {
    try {
      const results = await a.set([ p('foo', 100), f(50), p('baz', 10) ], 2)
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
    }
  })
  it("doesn't throw if promises throw after `count`", async () => {
    const results = await a.set([ p('foo', 100), f(50), p('baz', 10) ], 1)
    assert.deepEqual(results, ['baz'])
  })
  it("doesn't throw if rejections < ignore", async () => {
    const results = await a.set([ p('foo', 100), f(50), p('baz', 10) ], 2, 1)
    assert.deepEqual(results, ['baz', 'foo'])
  })
  it('throws if rejections > ignore', async () => {
    try {
      const results = await a.set([ f(120), p('foo', 100), f(50), f(10) ], 1, 1)
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
    }
  })
  it('throws if rejections > list.length - count even if ignore is higher', async () => {
    try {
      const results = await a.set([ p('foo', 100), f(50), f(10) ], 2, 2)
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
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
