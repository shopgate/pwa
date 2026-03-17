import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The stop icon component.
 */
const StopIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.stop} {...props} />);

export default StopIcon;
