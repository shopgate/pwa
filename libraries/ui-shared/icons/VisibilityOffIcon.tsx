import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The visibility off icon component.
 * https://material.io/tools/icons/?icon=visibility_off&style=baseline
 */
const VisibilityOffIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.visibilityOff} {...props} />);

export default VisibilityOffIcon;
