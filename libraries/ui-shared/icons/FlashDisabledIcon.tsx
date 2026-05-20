import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The FlashOff icon component.
 */
const FlashDisabled = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.flashDisabled} {...props} />);

export default FlashDisabled;
