const a = require('..')
const assert = require('chai').assert

describe('rejection', () => {
  it('returns an Error object on error', async () => {
    const err = await a.rejection(fail())
    assert.equal(err.message, 'fail')
  })
  it('returns undefined on success', async () => {
    const result = await a.rejection(succeed())
    assert.isUndefined(result)
  })

  async function fail() {
    await a.delay(10)
    throw new Error('fail')
  }

  async function succeed() {
    await a.delay(10)
  }
})
