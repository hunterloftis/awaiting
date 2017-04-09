const a = require('..')
const assert = require('chai').assert

describe('object', () => {
  it('returns the results of all promises', async () => {
    const results = await a.object({
      foo: p('foo'),
      bar: p('bar'),
      baz: p('baz')
    })
    assert.deepEqual(results, { foo: 'foo', bar: 'bar', baz: 'baz' })
  })
  it('throws if one of the results throws', async () => {
    try {
      const results = await a.object({
        foo: p('foo', 100),
        bar: f(50),
        baz: p('baz', 10)
      })
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
      assert.equal(err.get(0).message, 'fail')
    }
  })
  it("doesn't throw if failures < ignore", async () => {
    const results = await a.object({
      foo: p('foo', 100),
      bar: f(50),
      baz: p('baz', 10)
    }, 1)
    assert.deepEqual(results, { foo: 'foo', bar: undefined, baz: 'baz' })
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
