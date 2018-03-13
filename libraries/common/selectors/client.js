
/**
 * Returns client state (state.client)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getClientInformation = state => state.client;

/**
 * Check if the platform is android.
 * @param {Object} state The application state.
 * @return {boolean}
 */
export const isAndroid = (state) => {
  const client = getClientInformation(state);

  return client.device.os.platform === 'android';
};
