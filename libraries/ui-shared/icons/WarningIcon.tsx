import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The warning icon component.
 */
const WarningIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.warning} {...props} />);

export default WarningIcon;
