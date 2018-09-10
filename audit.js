const shimmer = require('shimmer')
const assert = require('assert')
const os = require('os')
const uuidv4 = require('uuid/v4')

module.exports = function (context, opts) {
  assert(opts, 'Options object must be defined')
  assert(typeof opts.eventName === 'string', 'Event name must be a string')
  assert(typeof opts.resource === 'string', 'Resource must be a string')

  context['audit-options'] = opts
  context['audit-queue'] = []
  context['audit-system'] = `${os.hostname()}-${os.platform()}`

  context['audit'] = extensionLogArgs => {
    const { eventName, resource } = context['audit-options']

    context['audit-queue'].push({
      auditId: uuidv4(),
      eventName: eventName,
      system: context['audit-system'],
      date: new Date().toISOString(),
      resource: resource,
      extensionLog: Array.from(extensionLogArgs)
    })
  }

  shimmer.wrap(context, 'log', function (original) {
    return function () {
      context['audit'](arguments)
      return original.apply(this, arguments)
    }
  })

  shimmer.wrap(context, 'done', function (original) {
    return function () {
      const audits = context['audit-queue']

      if (typeof context.res.body === 'string') {
        const body = JSON.parse(context.res.body)
        body['__audits'] = audits
        context.res.body = JSON.stringify(body)
      } else if (typeof context.res.body === 'object') {
        context.res.body['__audits'] = audits
      } else {
        /* Azure functions docs does not specify `res.body`
         * can be anything besides a String or Object.
         * If it can be another type it should be handeled here.
         * */
        throw new Error('Body is not string or object')
      }

      return original.apply(this, arguments)
    }
  })
}
