import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The list icon component.
 */
const List = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.list} {...props} />);

export default List;
