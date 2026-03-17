import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The browse icon component.
 */
const Browse = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.browse} {...props} />);

export default Browse;
