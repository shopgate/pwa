import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The logout icon component.
 */
const Logout = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.logout} {...props} />);

export default Logout;
