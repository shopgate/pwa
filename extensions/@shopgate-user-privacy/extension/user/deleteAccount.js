const UnauthorizedError = require('./../error/UnauthorizedError')

/**
 * @typedef {Object} DeleteAccountInput
 * @property {string} mail
 * @property {Object} sgxsMeta
 * @property {string} sgxsMeta.deviceIp
 */

/**
 * Create request to delete user account
 * @param {SDKContext} context The SDK context.
 * @param {DeleteAccountInput} input The input.
 * @returns {Promise<Object>}
 */
module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError('User is not logged in')
  }

  const query = {
    mail: encodeURIComponent(input.mail),
    ip: encodeURIComponent(input.sgxsMeta ? input.sgxsMeta.deviceIp : '10.10.10.10')
  }

  return {
    service: 'user',
    version: 'v1',
    path: `${context.meta.appId.split('_')[1]}/deleteRequests`,
    method: 'POST',
    query
  }
}
