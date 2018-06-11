import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/>';

/**
 * The checked radio component.
 *
 * @link https://material.io/tools/icons/?search=rad&icon=radio_button_checked&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const RadioUnchecked = props => <Icon content={content} {...props} />;

export default RadioUnchecked;
