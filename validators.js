const assert = require('assert')

module.exports = {
    accessToken: (req) => {
        assert.ok(req.body.accessToken)
        assert.ok(typeof req.body.accessToken === 'string')
        assert.ok(req.body.accessToken.startsWith('Bearer '))
    },
    resources: (req) => {
        assert.ok(req.body.resources)
        req.body.resources.forEach((res) => {
            assert.ok(typeof res === 'string')
            assert.ok(1 < res.split('/').length)
            assert.ok(res.split('/').length < 4)
        })
    }
}