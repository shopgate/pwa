import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The arrow-drop icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ArrowDrop = props => <Icon content={themeConfig.icons.arrowDrop} {...props} />;

export default ArrowDrop;
