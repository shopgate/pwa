import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The home icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Home = props => <Icon content={themeConfig.icons.home} {...props} />;

export default Home;
