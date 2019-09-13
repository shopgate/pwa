import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The add more icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const AddMore = props => <Icon content={themeConfig.icons.addMore} {...props} />;

export default AddMore;
