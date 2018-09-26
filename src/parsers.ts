import validate from './validators'

export default {
  accessTokenToCredentials: (req) => {
    // ensure we have a valid accessToken before proceeding
    validate.accessToken(req)

    // this implements the contract defined by msRestAzure
    // tslint:disable-next-line:max-line-length
    // see https://github.com/Azure/azure-sdk-for-node/blob/master/runtime/ms-rest-azure/lib/credentials/deviceTokenCredentials.js
    return {
      signRequest: (webResource, callback) => {
        webResource.headers.Authorization = req.body.accessToken
        callback(null)
      }
    }
  },
  resourcesToObjects: (req) => {
    // ensure we have a valid resources array before proceeding
    validate.resources(req)

    // parse the resources into objects
    return req.body.resources.map((r) => r.split('/')).map((r) => {
      return {
        resourceGroupName: r[1],
        resourceName: r[2],
        subscriptionId: r[0]
      }
    })
  }
}
