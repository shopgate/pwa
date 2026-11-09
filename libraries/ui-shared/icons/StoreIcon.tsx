import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const fallback = '<path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>';

/**
 * The store icon component.
 */
const Store = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.store || fallback} {...props} />);

export default Store;
