import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const fallback = '<path fill="none" d="M0 0h24v24H0z"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 3c-1-4-4-7-8-8V1h-2v2c-4 1-7 4-8 8H1v2h2c1 4 4 7 8 8v2h2v-2c4-1 7-4 8-8h2v-2h-2zm-9 8a7 7 0 110-14 7 7 0 010 14z"/>';

/**
 * The locator icon component.
 */
const Locator = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.locator || fallback} {...props} />);

export default Locator;
