const a = require('..')
const assert = require('chai').assert

describe('limit', () => {
  it('resolves to `goal` if `goal` finishes first', async () => {
    const result = await a.limit(goal('foo', 10), limit(50))
    assert.equal(result, 'foo')
  })

  it('throws an error if `limiter` finishes first', async () => {
    try {
      const result = await a.limit(goal('bar', 50), limit(10))
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'limit exceeded')
    }
  })

  it('re-throws an error if `goal` throws early', async () => {
    try {
      const result = await a.limit(fail(10), limit(50))
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'fail')
    }
  })

  it('swallows an error if `goal` throws late', async () => {
    try {
      const result = await a.limit(fail(50), limit(10))
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'limit exceeded')
    }
  })

  it('re-throws an error if `limiter` throws early', async () => {
    try {
      const result = await a.limit(goal('foo', 50), fail(10))
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'fail')
    }
  })

  it('swallows an error if `limiter` throws late', async () => {
    const result = await a.limit(goal('bar', 10), fail(50))
    assert.equal(result, 'bar')
  })

  it('limits by milliseconds if `limiter` is a Number', async () => {
    try {
      const result = await a.limit(goal('foo', 50), 10)
    }
    catch (err) {
      assert.equal(err.message, 'limit exceeded')
    }
  })

  async function goal(value, ms) {
    await a.delay(ms)
    return value
  }

  async function limit(ms) {
    await a.delay(ms)
  }

  async function fail(ms) {
    await a.delay(ms)
    throw new Error('fail')
  }
})
