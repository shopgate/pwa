import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The view list icon component.
 */
const ViewList = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.viewList} {...props} />);

export default ViewList;
