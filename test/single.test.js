const a = require('..')
const assert = require('chai').assert

describe('single', () => {

  it('returns the promise that finishes first', async () => {
    const result = await a.single([prefix('foo', 100), prefix('bar', 20)])
    assert.equal(result, 'p-bar')
  })

  it('rejects if a promise rejects early', async () => {
    try {
      await a.single([prefix('foo', 100), fail(50)])
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
    }
  })

  it('resolves if a promise rejects late', async () => {
    const result = await a.single([prefix('foo', 50), fail(100)])
    assert.equal(result, 'p-foo')
  })

  it('ignores rejections if ignore > failures', async () => {
    const result = await a.single([ prefix('foo', 100), fail(50) ], 2)
    assert.equal(result, 'p-foo')
  })

  it('throws if ignore is > failures but all promises fail', async () => {
    try {
      await a.single([ fail(100), fail(75), fail(50) ], Infinity)
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'too many failures')
    }
  })

  async function prefix(val, ms=50) {
    await a.delay(ms)
    return `p-${val}`
  }

  async function fail(ms) {
    await a.delay(ms)
    throw new Error('fail')
  }
})
