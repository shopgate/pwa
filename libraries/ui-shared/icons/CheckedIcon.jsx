import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The checked icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Checked = props => <Icon content={themeConfig.icons.checked} {...props} />;

export default Checked;
