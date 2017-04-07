const a = require('..')
const assert = require('chai').assert

describe('callback', () => {
  it('passes arguments and receives results', async () => {
    const result = await a.callback(read, 'foo.txt')
    assert.equal(result, 'contents')
  })
  it('throws an error if (err) is truthy', async () => {
    try {
      const result = await a.callback(read, 'bar.txt')
      throw new Error('should fail')
    }
    catch (err) {
      assert.equal(err.message, 'file not found')
    }
  })
})

function read(file, callback) {
  if (file !== 'foo.txt') {
    setTimeout(() => callback(new Error('file not found')), 0)
    return
  }
  setTimeout(() => callback(null, 'contents'), 0)
}
