import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>';

/**
 * The filter icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Filter = props => <Icon content={content} {...props} />;

export default Filter;
