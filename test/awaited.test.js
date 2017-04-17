const a = require('..')
const assert = require('chai').assert

describe('awaited', () => {
  const awaitedRead = a.awaited(read)

  it('awaited correctly handles resolution', async () => {
    const result = await awaitedRead('foo.txt')
    assert.equal(result, 'contents')
  })

  it('awaited correctly handles rejection', async () => {
    try {
      const result = await awaitedRead('bar.txt')
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
