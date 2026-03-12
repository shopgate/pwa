import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The locator icon component.
 */
const Locator = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.locator} {...props} />);

export default Locator;
