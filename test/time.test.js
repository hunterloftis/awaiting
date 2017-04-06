const a = require('..')
const assert = require('chai').assert

describe('time', () => {
  it('waits for epoch milliseconds if a number is a provided', async () => {
    const start = Date.now()
    await a.time(start + 100)
    assert.closeTo(Date.now() - start, 100, 10)
  })
  it('waits until a date if a Date object is provided', async () => {
    const now = new Date()
    const start = now.getTime()
    const end = new Date(now.getYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds() + 100)
    await a.time(end)
    assert.closeTo(Date.now() - start, 100, 10)
  })
})
