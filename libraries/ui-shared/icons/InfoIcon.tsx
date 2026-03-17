import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The info icon component.
 */
const InfoIcon = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.info} {...props} />);

export default InfoIcon;
