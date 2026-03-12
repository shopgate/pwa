import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The Share icon component.
 */
const ShareIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.share} {...props} />);

export default ShareIcon;
