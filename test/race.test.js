const a = require('..')
const assert = require('chai').assert

describe('race', () => {

  it('returns the promise that finishes first', async () => {
    const result = await a.race([prefix('foo', 100), prefix('bar', 20)])
    assert.equal(result, 'p-bar')
  })

  it('rejects if a promise rejects early', async () => {
    try {
      await a.race([prefix('foo', 100), fail(50)])
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'fail')
    }
  })

  it('resolves if a promise rejects late', async () => {
    const result = await a.race([prefix('foo', 50), fail(100)])
    assert.equal(result, 'p-foo')
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
