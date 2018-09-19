import assert = require("assert")

export default {
  accessToken: (req) => {
    assert.ok(req.body.accessToken)
    assert.ok(typeof req.body.accessToken === 'string')
    assert.ok(req.body.accessToken.startsWith('Bearer '))
  },
  resources: (req) => {
    assert.ok(req.body.resources)
    req.body.resources.forEach((res) => {
      assert.ok(typeof res === 'string')
      assert.ok(res.split('/').length > 1)
      assert.ok(res.split('/').length < 4)
    })
  }
}
