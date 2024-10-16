import { AppCommandRequest } from '@shopgate/engage/core/classes';

/**
 * @typedef {Object} AnalyticsSetConsentResponse
 * @property {string} status Update status
 * @property {string} error Update error message
 */

/**
 * Sends cookie consent settings to the app
 * @param {Object} params Command params
 * @param {boolean} [params.statistics=false] Setting for statistics consent
 * @param {boolean} [params.comfort=false] Setting for comfort consent
 * @returns {Promise<AnalyticsSetConsentResponse>}
 */
const analyticsSetConsent = (params = {}) =>
  new AppCommandRequest('analyticsSetConsent')
    .setCommandParams({
      statistics: false,
      comfort: false,
      ...params,
    })
    .dispatch();

export default analyticsSetConsent;
