import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The placeholder icon component.
 */
const Placeholder = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.placeholder} {...props} />);

export default Placeholder;
