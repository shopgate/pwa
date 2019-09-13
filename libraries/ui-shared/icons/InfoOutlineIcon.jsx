import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The info outline icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const InfoOutline = props => <Icon content={themeConfig.icons.infoOutline} {...props} />;

export default InfoOutline;
