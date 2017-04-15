const a = require('..')
const assert = require('chai').assert

describe('promisified', () => {
  const promisifiedRead = a.promisified(read)

  it('promisified correctly handles resolution', async () => {
    const result = await promisifiedRead('foo.txt')
    assert.equal(result, 'contents')
  })

  it('promisified correctly handles rejection', async () => {
    try {
      const result = await promisifiedRead('bar.txt')
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
