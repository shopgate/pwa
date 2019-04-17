import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M15.22,3.1,12,9.51l-.8,1.59h3.86l-4,6.83v-6h-3V3.1h7.12M17,2h0Zm0,0H7V13h3v9l7-12H13l4-8Z" />';

/**
 * The FlashOff icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const FlashDisabled = props => <Icon content={content} {...props} width="24" height="24" viewBox="0 0 24 24" />;

export default FlashDisabled;
