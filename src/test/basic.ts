import * as assert from 'assert'
import * as sinon from 'sinon'

import isEqual = require('lodash.isequal')

import { IAudit } from '../audit'
import index from '../index'

interface IHeader {
  Authorization?: string
}

interface IBody {
  __audits?: IAudit[]
}

describe('platform-chaos', () => {
  it('is named properly', () => {
    assert.equal(require('../../package.json').name, 'platform-chaos')
    assert.equal(require('../../package-lock.json').name, 'platform-chaos')
  })
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

    assert.equal(instance.subscriptionId, 'sub')
    assert.equal(instance.resourceGroupName, 'rg')
    assert.equal(instance.resourceName, 'resource')
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
          accessToken: 'valid type'
        }
      })
    })

    // invalid resourceIds type
    assert.throws(() => {
      index.validators.accessToken({
        body: {
          accessToken: 'valid type'
        }
      })
    })

    // invalid resourceIds format
    assert.throws(() => {
      index.validators.accessToken({
        body: {
          accessToken: 'valid type'
        }
      })
    })

    // valid
    const expectedAccessToken = 'Bearer 12345234r2'
    const instance = index.parsers.accessTokenToCredentials({
      body: {
        accessToken: expectedAccessToken
      }
    })

    const res = {
      headers: {} as IHeader
    }

    instance.signRequest(res, () => null)

    assert.equal(res.headers.Authorization, expectedAccessToken)
  })

  it('audits correctly', () => {
    function contextLog () {
      // in reality this would be `console.log(...arguments)`
      // but in order to not clutter test we noop this
      return () => null
    }
    function contextDone () {
      return () => null
    }

    const contextLogSpy = sinon.spy(contextLog)
    const contextDoneSpy = sinon.spy(contextDone)

    const context = {
      done: contextDoneSpy,
      log: contextLogSpy,
      res: { body: {} }
    }

    index.auditer.initialize(context, {
      eventName: 'testEvent',
      resources: 'testResource'
    })

    const logItem1 = {
      anotherProp: 'more important info',
      prop1: 'important information'
    }
    const logItem2 = 'Hello, World!'
    const logItem3 = ['abc', { a: 12 }]

    context.log(logItem1)
    context.log(logItem2)
    context.log(...logItem3)

    context.res.body = {
      message: 'I am writing to the body'
    }

    context.done()

    assert(contextLogSpy.called, 'context.log should be called')
    assert(contextDoneSpy.called, 'context.done should be called')

    const body: IBody = context.res.body

    assert(typeof body === 'object', 'context.res.body should exist as an object')
    assert(body.hasOwnProperty('__audits'), 'body contains __audits property')
    assert(isEqual(body.__audits[0].extensionLog[0], logItem1), 'log item 1 is added to audit correctly')
    assert(isEqual(body.__audits[1].extensionLog[0], logItem2), 'log item 2 is added to audit correctly')
    assert(isEqual(body.__audits[2].extensionLog, logItem3), 'log item 3 is added to audit correctly')
  })

  it('allows user to audit directly', () => {
    function contextLog () {
      // in reality this would be `console.log(...arguments)`
      // but in order to not cluter test we noop this
      return () => null
    }
    function contextDone () {
      return () => null
    }

    const contextLogSpy = sinon.spy(contextLog)
    const contextDoneSpy = sinon.spy(contextDone)

    const context = {
      done: contextDoneSpy,
      log: contextLogSpy,
      res: { body: {} }
    }

    const opts = {
      eventName: 'testEvent',
      resources: 'testResource'
    }

    index.auditer.initialize(context, opts)

    index.auditer.audit('Hello, World!', opts)

    context.done()

    assert(contextLogSpy.notCalled, 'context.log should not be called')
    assert(contextDoneSpy.called, 'context.done should be called')

    const body: IBody = context.res.body

    assert(typeof body === 'object', 'context.res.body should exist as an object')
    assert(body.hasOwnProperty('__audits'), 'body contains __audits property')
    assert(body.__audits[0].extensionLog[0] === 'Hello, World!', 'log item 1 is added to audit correctly')
  })
})
