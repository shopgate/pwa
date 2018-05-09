import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M7 10l5 5 5-5z"/>';

/**
 * The arrow-drop icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ArrowDrop = props => <Icon content={content} {...props} />;

export default ArrowDrop;
