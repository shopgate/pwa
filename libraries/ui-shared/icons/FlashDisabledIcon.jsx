import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The FlashOff icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const FlashDisabled = props => <Icon content={themeConfig.icons.flashDisabled} {...props} />;

export default FlashDisabled;
