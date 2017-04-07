const a = require('../..')
const assert = require('chai').assert
const spawnSync = require('child_process').spawnSync
const join = require('path').join

describe('rejections', () => {
  describe('ignored', () => {
    it('logs useless console logs', () => {
      const fixture = join(__dirname, '../fixtures/rejection-ignore.js')
      const results = spawnSync('node', [fixture], { encoding: 'utf8' })
      const output = results.output.join('\n')
      assert.include(output, 'UnhandledPromiseRejectionWarning:')
      assert.notInclude(output, 'at fail')
    })
  })
  describe('throw', () => {
    it('throws on unhandled rejections', () => {
      const fixture = join(__dirname, '../fixtures/rejection-throw.js')
      const results = spawnSync('node', [fixture], { encoding: 'utf8' })
      const output = results.output.join('\n')
      assert.include(output, 'Error: fail')
      assert.include(output, 'at fail')
      assert.include(output, 'at Object')
      assert.notInclude(output, 'UnhandledPromiseRejectionWarning:')
    })
    it('only throws once', () => {
      const fixture = join(__dirname, '../fixtures/rejection-multiple.js')
      const results = spawnSync('node', [fixture], { encoding: 'utf8' })
      const output = results.output.join('\n')
      const count = output.match(/Error: fail/g).length
      assert.equal(count, 1)
    })
  })
  describe('swallow', () => {
    it('hides unhandled rejections', () => {
      const fixture = join(__dirname, '../fixtures/rejection-swallow.js')
      const results = spawnSync('node', [fixture], { encoding: 'utf8' })
      const output = results.output.join('\n')
      assert.notInclude(output, 'Error: fail')
      assert.notInclude(output, 'UnhandledPromiseRejectionWarning:')
    })
  })
})
