import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The star icon component
 */
const Star = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.star} {...props} />);

export default Star;
