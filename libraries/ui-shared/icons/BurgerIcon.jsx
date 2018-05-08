import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';

/**
 * The burger icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Burger = props => <Icon content={content} {...props} />;

export default Burger;
