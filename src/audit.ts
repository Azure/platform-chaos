import * as assert from 'assert'
import * as os from 'os'
import * as shimmer from 'shimmer'
import * as uuidv4 from 'uuid'

/* interface implementation of Audit defined in
 * https://github.com/Azure/platform-chaos/wiki/Auditing
 * */
export interface IAudit {
  auditId: string,
  date: string,
  eventName: string,
  extensionLog: string[],
  resources: string,
  system: string
}

interface IAuditOptions {
  eventName: string,
  resources: string
}

const auditSystem = `${os.hostname()}-${os.platform()}`
let auditQueue: IAudit[] = []

const audit = (extensionLogArgs, auditOptions: IAuditOptions) => {
  const { eventName, resources } = auditOptions

  auditQueue.push({
    auditId: uuidv4(),
    date: new Date().toISOString(),
    eventName,
    extensionLog: typeof extensionLogArgs === 'string' ? [ extensionLogArgs ] : Array.from(extensionLogArgs),
    resources,
    system: auditSystem
  })
}

export default {
  audit,
  initialize: (context: any, opts: IAuditOptions) => {
    assert(opts, 'Options object must be defined')

    const auditOptions = opts

    auditQueue = []

    shimmer.wrap(context, 'log', (original: (message: any) => void) => {
      return function () {
        audit(arguments, auditOptions)
        return original.apply(this, arguments)
      }
    })

    shimmer.wrap(context, 'done', (original: (err: any, propertyBag: any) => void) => {
      return function () {
        const audits = auditQueue

        if (typeof context.res.body === 'undefined') {
          context.rex.body = {
            __audits: audits
          }
        } else if (typeof context.res.body === 'string') {
          const body = JSON.parse(context.res.body)
          body.__audits = audits
          context.res.body = JSON.stringify(body)
        } else if (typeof context.res.body === 'object') {
          context.res.body.__audits = audits
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
