import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path fill="none" d="M-1-1h802v602H-1z"/><g><circle r="5.18" cy="9.207" cx="12.014" fill="#fff"/><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z"/><path d="M-1.749 3.31h24v24h-24v-24z" fill="none"/></g>';

/**
 * The location icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Location = props => <Icon content={content} {...props} />;

export default Location;
