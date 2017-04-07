const a = require('../..')

a.throw()
fail()

async function fail() {
  throw new Error('fail')
}
