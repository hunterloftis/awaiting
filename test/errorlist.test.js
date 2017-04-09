const a = require('..')
const assert = require('chai').assert

describe('ErrorList', () => {
  it('can be thrown', () => {
    try {
      throw new a.ErrorList('testing')
      throw new Error('should not get here')
    }
    catch (err) {
      assert.equal(err.message, 'testing')
    }
  })
  it('can be added to', () => {
    const err = new a.ErrorList('foo')
    err.add(new Error('bar'))
    assert.equal(err.get(0).message, 'bar')
  })
  it('can be iterated over', () => {
    const list = new a.ErrorList('foo')
    const messages = []
    list.add(new Error('bar'))
    list.add(new Error('baz'))
    for (let err of list) {
      messages.push(err.message)
    }
    assert.deepEqual(messages, ['bar', 'baz'])
  })
})
