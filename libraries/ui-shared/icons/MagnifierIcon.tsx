import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The magnifier icon component.
 */
const Magnifier = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.magnifier} {...props} />);

export default Magnifier;
