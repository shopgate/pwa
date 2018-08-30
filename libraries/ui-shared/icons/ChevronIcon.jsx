import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none" />';

/**
 * The chevron icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Chevron = props => <Icon content={content} {...props} />;

export default Chevron;
