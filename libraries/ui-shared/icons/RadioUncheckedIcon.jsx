import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The checked radio component.
 *
 * @link https://material.io/tools/icons/?search=rad&icon=radio_button_checked&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const RadioUnchecked = props => <Icon content={themeConfig.icons.radioUnchecked} {...props} />;

export default RadioUnchecked;
