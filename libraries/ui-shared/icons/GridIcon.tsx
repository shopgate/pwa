import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The grid icon component.
 */
const Grid = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.grid} {...props} />);

export default Grid;
