const shimmer = require('shimmer')
const os = require('os')
const uuidv4 = require('uuid/v4')

module.exports = function (context) {
  context['audit-queue'] = []

  shimmer.wrap(context, 'log', function (original) {
    console.log(original)
    console.log(arguments)
    // instead of the user passing a string to the context.log they will
    // pass an object with the following properties
    const { isChaosEvent, eventName, extensionLogs, resource } = arguments[2]
    if (isChaosEvent) {
      context['audit-queue'].push(JSON.stringify({
        eventId: uuidv4(),
        eventName: eventName,
        system: `${os.hostname}-${os.system}`,
        date: new Date().toISOString(),
        resource: resource,
        extension: extensionLogs
      }))
    }
    return original.apply(this, arguments)
  })

  shimmer.wrap(context, 'done', function (original) {
    const audits = context['audit-queue']

    context.res.body['audits'] = audits

    return original.apply(this, arguments)
  })
}
