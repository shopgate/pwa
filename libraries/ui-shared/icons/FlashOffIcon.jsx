import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M0 0h24v24H0z" fill="none"/><path d="M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3zM17 10h-4l4-8H7v2.18l8.46 8.46L17 10z"/>';

/**
 * The FlashOff icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const FlashOff = props => <Icon content={content} {...props} width="24" height="24" viewBox="0 0 24 24" />;

export default FlashOff;
