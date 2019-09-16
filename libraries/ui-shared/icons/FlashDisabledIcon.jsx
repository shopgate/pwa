import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The FlashOff icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const FlashDisabled = props => <Icon content={themeConfig.icons.flashDisabled} {...props} width="24" height="24" viewBox="0 0 24 24" />;

export default FlashDisabled;
