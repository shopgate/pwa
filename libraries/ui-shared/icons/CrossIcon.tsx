import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The cross icon component.
 */
const Cross = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.cross} {...props} />);

export default Cross;
