const a = require('..')
const assert = require('chai').assert

describe('time', () => {
  it('waits until a date if a Date object is provided', async () => {
    const start = Date.now()
    const end = new Date(start + 100)
    await a.time(end)
    assert.closeTo(Date.now() - start, 100, 10)
  })
})
