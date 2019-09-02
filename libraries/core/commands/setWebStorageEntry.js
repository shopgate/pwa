import AppCommand from '../classes/AppCommand';

/**
 * This commands set up entries with values in the WebStorageRequest. This storage is mainly meant
 * to be a data storage for web views. The entry with its value can fetched by using
 * getWebStorageEntry.
 * @param {Object} params The command parameters
 * @param {string} params.name The name of the entry, that shall be set or deleted
 * @param {*}      params.value The value that shall be saved. null or omitting means
 *   that the entry will be deleted.
 * @param {number} params.timeout The cache time how long the entry shall be stored in seconds
 *   0 or omitting means that the entry won't be deleted automatically
 */
export default function setWebStorageEntry(params) {
  const command = new AppCommand();
  command
    .setCommandName('setWebStorageEntry')
    .dispatch(params);
}
