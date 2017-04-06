const a = require('..')
const assert = require('chai').assert

describe('delay', () => {
  it('delays by (ms) milliseconds', async () => {
    const start = Date.now()
    await a.delay(100)
    assert.closeTo(Date.now() - start, 100, 10)
  })
})
