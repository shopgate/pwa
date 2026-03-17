import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The half-filled star icon component
 */
const StarHalfIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.starHalf} {...props} />);

export default StarHalfIcon;
