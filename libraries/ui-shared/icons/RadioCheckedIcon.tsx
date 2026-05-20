import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The checked radio component.
 *
 * @link https://material.io/tools/icons/?search=rad&icon=radio_button_checked&style=baseline
 *
 */
const RadioChecked = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.radioChecked} {...props} />);

export default RadioChecked;
