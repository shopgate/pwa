import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M0 0h24v24H0z" fill="none"/><path d="M7 2v11h3v9l7-12h-4l4-8z"/>';

/**
 * The FlashOn icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const FlashOn = props => <Icon content={content} {...props} width="24" height="24" viewBox="0 0 24 24" />;

export default FlashOn;
