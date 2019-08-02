import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/><path fill="none" d="M0 0h24v24H0z"/>';

/**
 * The location icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Location = props => <Icon content={content} {...props} />;

export default Location;
