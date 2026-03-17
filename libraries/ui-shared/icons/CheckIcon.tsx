import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The check icon component.
 */
const Check = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.check} {...props} />);

export default Check;
