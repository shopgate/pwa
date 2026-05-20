import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The tick icon component.
 */
const Tick = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.tick} {...props} />);

export default Tick;
