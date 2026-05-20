import React from 'react';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';

/**
 * The heart-outline icon component.
 */
const HeartOutline = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.heartOutline} {...props} />);

export default HeartOutline;
