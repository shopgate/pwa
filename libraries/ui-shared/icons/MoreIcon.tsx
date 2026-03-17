import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The more icon component.
 */
const More = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.more} {...props} />);

export default More;
