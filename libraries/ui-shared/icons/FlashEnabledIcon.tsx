import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The FlashOn icon component.
 */
const FlashEnabled = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.flashEnabled} {...props} />);

export default FlashEnabled;
