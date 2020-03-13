import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The info icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const InfoIcon = props => <Icon content={themeConfig.icons.info} {...props} />;

export default InfoIcon;
