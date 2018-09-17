const shimmer = require('shimmer')
const assert = require('assert')
const os = require('os')
const uuidv4 = require('uuid/v4')

const auditSystem = `${os.hostname()}-${os.platform()}`
let auditQueue = []

const audit = (extensionLogArgs, auditOptions) => {
  const { eventName, resources } = auditOptions

  auditQueue.push({
    auditId: uuidv4(),
    eventName: eventName,
    system: auditSystem,
    date: new Date().toISOString(),
    resources: resources,
    extensionLog: typeof extensionLogArgs === 'string' ? [ extensionLogArgs ] : Array.from(extensionLogArgs)
  })
}

module.exports = {
  audit: audit,
  initialize: (context, opts) => {
    assert(opts, 'Options object must be defined')
    assert(typeof opts.eventName === 'string', 'Event name must be a string')
    assert(typeof opts.resources === 'string', 'Resources must be a string')

    const auditOptions = opts

    auditQueue = []

    shimmer.wrap(context, 'log', function (original) {
      return function () {
        audit(arguments, auditOptions)
        return original.apply(this, arguments)
      }
    })

    shimmer.wrap(context, 'done', function (original) {
      return function () {
        const audits = auditQueue

        if (typeof context.res.body === 'undefined') {
          context.rex.body = {
            __audits: audits
          }
        } else if (typeof context.res.body === 'string') {
          const body = JSON.parse(context.res.body)
          body['__audits'] = audits
          context.res.body = JSON.stringify(body)
        } else if (typeof context.res.body === 'object') {
          context.res.body['__audits'] = audits
        }
        /*
         * If context.res.body is not of type string or object
         * do not append the audits list to it and return it
         * as usual.
         * */

        return original.apply(this, arguments)
      }
    })
  }
}
