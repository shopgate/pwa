import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The lock icon component.
 * @link https://material.io/tools/icons/?icon=lock&style=baseline
 *
 */
const LockIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.lock} {...props} />);

export default LockIcon;
