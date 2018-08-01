import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/>';

/**
 * The navigate chevron next icon component.
 * You can rotate it with css rule
 * transform: rotate(180deg)
 *
 * @link https://material.io/tools/icons/?icon=chevron_right&style=baseline
 *
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ChevronIcon = props => <Icon content={content} {...props} />;

export default ChevronIcon;
