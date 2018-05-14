import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M4,6H20c0.6,0,1.1,0.5,1.1,1.1v0c0,0.6-0.5,1.1-1.1,1.1H4c-0.6,0-1.1-0.5-1.1-1.1v0 C2.8,6.5,3.3,6,4,6z"/><path d="M7.4,10.6h9.2c0.6,0,1.1,0.5,1.1,1.1v0c0,0.6-0.5,1.1-1.1,1.1H7.4c-0.6,0-1.1-0.5-1.1-1.1 v0C6.3,11.1,6.8,10.6,7.4,10.6z"/><path d="M10.9,15.2h2.3c0.6,0,1.1,0.5,1.1,1.1v0c0,0.6-0.5,1.1-1.1,1.1h-2.3 c-0.6,0-1.1-0.5-1.1-1.1v0C9.7,15.7,10.2,15.2,10.9,15.2z"/>';

/**
 * The filter icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Filter = props => <Icon content={content} {...props} />;

export default Filter;
