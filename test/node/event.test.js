const a = require('../..')
const assert = require('chai').assert
const EventEmitter = require('events').EventEmitter

describe('event', () => {
  it('waits until the event is emitted', async () => {
    const emitter = Emitter('listen', 100)
    const start = Date.now()
    assert.equal(emitter.emitted, false)
    await a.event(emitter, 'listen')
    assert.closeTo(Date.now() - start, 100, 10)
    assert.equal(emitter.emitted, true)
  })
  it("returns an array of the event's arguments", async () => {
    const emitter = Emitter('close', 10, 'foo', 123)
    const results = await a.event(emitter, 'close')
    assert.deepEqual(results, ['foo', 123])
  })
})

function Emitter(eventName, ms, ...args) {
  const emitter = new EventEmitter()
  emitter.emitted = false

  setTimeout(() => {
    emitter.emitted = true
    emitter.emit(eventName, ...args)
  }, ms)

  return emitter
}
