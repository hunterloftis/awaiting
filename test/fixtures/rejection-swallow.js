const a = require('../..')

a.swallow()
fail()

async function fail() {
  throw new Error('fail')
}
