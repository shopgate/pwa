import { configuration } from '@shopgate/pwa-common/collections';
import { IS_CONNECT_EXTENSION_ATTACHED } from '@shopgate/pwa-common/constants/Configuration';

/**
 * Determines if the PWA uses the new backend services
 * @returns {boolean}
 */
export const hasNewServices = () => !!configuration.get(IS_CONNECT_EXTENSION_ATTACHED);
