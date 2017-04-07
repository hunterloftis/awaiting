const a = require('../..')

a.swallow()
a.throw()
a.swallow()
a.throw()
a.throw()
fail()

async function fail() {
  throw new Error('fail')
}
