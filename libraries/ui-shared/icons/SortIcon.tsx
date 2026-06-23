import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The sort icon component.
 */
const Sort = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.sort} {...props} />);

export default Sort;
