const a = require('..')
const assert = require('chai').assert

describe('success', () => {
  it('returns a value on success', async () => {
    const result = await a.success(succeed())
    assert.equal(result, 'ok')
  })
  it('returns undefined on error', async () => {
    const result = await a.success(fail())
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
