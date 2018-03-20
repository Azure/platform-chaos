const assert = require('assert')
const index = require('../')

describe('azure-chaos-fn', () => {
    it('parses resources', () => {
        assert.throws(() => {
            index.validators.resources({
                body: {
                    resources: [1]
                }
            })
        })

        assert.throws(() => {
            index.validators.resources({
                body: {
                    resources: ['']
                }
            })
        })

        assert.throws(() => {
            index.validators.resources({
                body: {
                    resources: ['one/two/three/four']
                }
            })
        })

        const instance = index.parsers.resourcesToObjects({
            body: {
                resources: ['sub/rg/resource']
            }
        })[0]

        assert.equal(instance.subscriptionId, "sub")
        assert.equal(instance.resourceGroupName, "rg")
        assert.equal(instance.resourceName, "resource")
    })

    it('parses accessTokens', () => {
        // invalid at
        assert.throws(() => {
            index.validators.accessToken({
                body: {
                    accessToken: 1
                }
            })
        })

        // empty resourceIds
        assert.throws(() => {
            index.validators.accessToken({
                    body: {
                    accessToken: "valid type"
            }
            })
        })

        // invalid resourceIds type
        assert.throws(() => {
            index.validators.accessToken({
                body: {
                    accessToken: "valid type"
                }
            })
        })

        // invalid resourceIds format
        assert.throws(() => {
            index.validators.accessToken({
                body: {
                    accessToken: "valid type"
                }
            })
        })

        // valid
        const expectedAccessToken = "Bearer 12345234r2"
        const instance =index.parsers.accessTokenToCredentials({
            body: {
                accessToken: expectedAccessToken
            }
        })

        const res = {
            headers: {}
        }

        instance.signRequest(res, () => {})

        assert.equal(res.headers['Authorization'], expectedAccessToken)
    })
})