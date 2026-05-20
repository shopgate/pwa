import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The star-outline icon component.
 */
const StarOutline = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.starOutline} {...props} />);

export default StarOutline;
