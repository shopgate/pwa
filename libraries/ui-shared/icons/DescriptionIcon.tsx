import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The description icon component.
 */
const Description = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.description} {...props} />);

export default Description;
