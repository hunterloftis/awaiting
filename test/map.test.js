const a = require('..')
const assert = require('chai').assert

describe('map', () => {
  it('maps all items to promises', async () => {
    let results = await a.map(['foo', 'bar', 'baz'], 1, prefix)
    assert.deepEqual(results, ['p-foo', 'p-bar', 'p-baz'])
  })
  it('throws if anything rejects', async () => {
    try {
      await a.map(['foo', 'bar', 'baz'], 2, hatesBar)
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'bar sucks')
    }
  })
  it('throttles concurrency', async () => {
    let max = 0
    let current = 0
    await a.map([10, 20, 30, 10, 50, 100, 0, 50, 10], 3, maximum)
    assert.equal(max, 3)

    async function maximum(ms) {
      current++
      max = Math.max(current, max)
      await a.delay(ms)
      current--
    }
  })

  async function prefix(val) {
    await a.delay(10)
    return `p-${val}`
  }

  async function hatesBar(val) {
    await a.delay(10)
    if (val === 'bar') throw new Error('bar sucks')
  }
})
