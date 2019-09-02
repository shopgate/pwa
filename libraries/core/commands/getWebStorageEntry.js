import WebStorageRequest from '../classes/WebStorageRequest';

/**
 * With this command you can get the value of a WebStorageRequest, that has been set with
 * setWebStorageEntry.
 * @param {Object} params The command parameters
 * @param {string} params.name The name of the entry, that shall be given back.
 * @return {Promise}
 */
export default function getWebStorageEntry(params) {
  const { name } = params;

  const storage = new WebStorageRequest(name);
  return storage.dispatch();
}
