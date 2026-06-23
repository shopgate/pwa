import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The visibility icon component.
 * https://material.io/tools/icons/?icon=visibility&style=baseline
 */
const VisibilityIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.visibility} {...props} />);

export default VisibilityIcon;
