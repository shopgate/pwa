import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Whether the beta features are enabled.
 * @returns {boolean}
 */
export function isBeta() {
  return !!appConfig.beta;
}
