const shimmer = require('shimmer')
const os = require('os')
const uuidv4 = require('uuid/v4')

module.exports = function (context) {
  context['audit-queue'] = []

  shimmer.wrap(context, 'log', function (original) {
    const arg = arguments[0]

    if (typeof arg === 'object') {
      const { eventName, resource, extensionLogs } = arg
      context['audit-queue'].push(JSON.stringify({
        eventId: uuidv4(),
        eventName: eventName,
        system: `${os.hostname}-${os.system}`,
        date: new Date().toISOString(),
        resource: resource,
        extension: extensionLogs
      }))

      return original.apply(this, [ 'Log added to audit queue' ])
    } else {

      return original.apply(this, arguments)
    }

  })

  shimmer.wrap(context, 'done', function (original) {
    const audits = context['audit-queue']

    context.res.body['audits'] = audits

    return original.apply(this, arguments)
  })
}
