const a = require('..')
const assert = require('chai').assert

describe('time', () => {
  it('waits for (time)', async () => {
    const start = Date.now()
    await a.time(start + 100)
    assert.closeTo(Date.now() - start, 100, 10)
  })
})
