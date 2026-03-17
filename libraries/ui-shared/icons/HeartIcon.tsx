import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The heart icon component.
 */
const Heart = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.heart} {...props} />);

export default Heart;
