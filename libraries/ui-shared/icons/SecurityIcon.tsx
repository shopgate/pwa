import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The security icon component.
 */
const Security = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.security} {...props} />);

export default Security;
