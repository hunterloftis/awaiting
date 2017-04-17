const a = require('..')
const assert = require('chai').assert

describe('awaitable', () => {
  const awaitableRead = a.awaitable(read)

  it('awaitable correctly handles resolution', async () => {
    const result = await awaitableRead('foo.txt')
    assert.equal(result, 'contents')
  })

  it('awaitable correctly handles rejection', async () => {
    try {
      const result = await awaitableRead('bar.txt')
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
