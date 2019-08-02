import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path fill="none" d="M0 0h24v24H0z"/><path d="M7 11c1 3 3 5 6 6l2-2h1l4 1 1 1v3l-1 1C11 21 3 13 3 4l1-1h4l1 1v5l-2 2z"/>';

/**
 * The phone icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Phone = props => <Icon content={content} {...props} />;

export default Phone;
