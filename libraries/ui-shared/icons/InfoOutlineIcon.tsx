import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The info outline icon component.
 */
const InfoOutline = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.infoOutline} {...props} />);

export default InfoOutline;
