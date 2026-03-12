import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The local shipping icon component.
 */
const LocalShipping = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.localShipping} {...props} />);

export default LocalShipping;
