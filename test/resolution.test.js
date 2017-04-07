const a = require('..')
const assert = require('chai').assert

describe('resolution', () => {
  it('returns a value on success', async () => {
    const result = await a.resolution(succeed())
    assert.equal(result, 'ok')
  })
  it('returns undefined on error', async () => {
    const result = await a.resolution(fail())
    assert.isUndefined(result)
  })

  async function fail() {
    await a.delay(10)
    throw new Error('fail')
  }

  async function succeed() {
    await a.delay(10)
    return 'ok'
  }
})
