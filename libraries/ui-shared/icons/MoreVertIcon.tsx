import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The more vertical icon component.
 */
const MoreVert = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.moreVert} {...props} />
);

export default MoreVert;
