import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M8.5,22.5c0-2.209,1.791-4,4-4h10v-4h-10c-4.418,0-8,3.582-8,8v10h4V22.5z     M8.5,78.5v-10h-4v10c0,4.418,3.582,8,8,8h10v-4h-10C10.291,82.5,8.5,80.709,8.5,78.5z M92.5,78.5c0,2.209-1.791,4-4,4h-10v4h10    c4.418,0,8-3.582,8-8v-10h-4V78.5z M88.5,14.5h-10v4h10c2.209,0,4,1.791,4,4v10h4v-10C96.5,18.082,92.918,14.5,88.5,14.5z     M8.5,50.5c0,1.104,0.896,2,2,2h80c1.104,0,2-0.896,2-2s-0.896-2-2-2h-80C9.396,48.5,8.5,49.396,8.5,50.5z M40.5,26.5h-4v18h4    V26.5z M16.5,26.5v18h4v-18H16.5z M48.5,26.5h-4v18h4V26.5z M68.5,26.5h-4v18h4V26.5z M76.5,26.5h-4v18h4V26.5z M80.5,26.5v18h4    v-18H80.5z M32.5,26.5h-8v18h8V26.5z M60.5,26.5h-8v18h8V26.5z M36.5,74.5h4v-18h-4V74.5z M20.5,74.5v-18h-4v18H20.5z M44.5,74.5    h4v-18h-4V74.5z M64.5,74.5h4v-18h-4V74.5z M72.5,74.5h4v-18h-4V74.5z M84.5,74.5v-18h-4v18H84.5z M24.5,74.5h8v-18h-8V74.5z     M52.5,74.5h8v-18h-8V74.5z"/>';

/**
 * The barcode icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const BarcodeScanner = props => <Icon content={content} {...props} viewBox="0 0 100 100" />;

export default BarcodeScanner;
