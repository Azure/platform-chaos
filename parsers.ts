import validate from './validators'

export default {
  accessTokenToCredentials: (req) => {
    // ensure we have a valid accessToken before proceeding
    validate.accessToken(req)

    // this implements the contract defined by msRestAzure
    // see https://github.com/Azure/azure-sdk-for-node/blob/0a52678ea7b3a24a478975f7169fc30e9fc9759e/runtime/ms-rest-azure/lib/credentials/deviceTokenCredentials.js
    return {
      signRequest: (webResource, callback) => {
        webResource.headers['Authorization'] = req.body.accessToken
        callback(null)
      }
    }
  },
  resourcesToObjects: (req) => {
    // ensure we have a valid resources array before proceeding
    validate.resources(req)

    // parse the resources into objects
    return req.body.resources.map(r => r.split('/')).map(r => {
      return {
        subscriptionId: r[0],
        resourceGroupName: r[1],
        resourceName: r[2]
      }
    })
  }
}
