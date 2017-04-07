const a = require('..')
const assert = require('chai').assert

describe('completion', () => {
  it('returns a value on success', async () => {
    const result = await a.completion(succeed())
    assert.equal(result, 'ok')
  })
  it('returns the Error on error', async () => {
    const result = await a.completion(fail())
    assert.equal(result.message, 'fail')
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
