import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The home icon component.
 */
const Home = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.home} {...props} />
);

export default Home;
