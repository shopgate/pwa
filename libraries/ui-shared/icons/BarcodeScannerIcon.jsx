import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M89.6,129.7h40.1v240.5H89.6V129.7z M149.8,129.7h20.1v240.5h-20.1V129.7z M189.9,129.7H250v240.5h-60.1V129.7z  M270.1,129.7h20.1v240.5H270L270.1,129.7L270.1,129.7z M330.2,129.7h40.1v240.5h-40.1V129.7z M390.3,129.7h20.1v240.5h-20.1V129.7z  M49.5,89.6v80.2H9.4V89.6c0-10.6,4.2-20.8,11.7-28.3c7.5-7.5,17.7-11.7,28.3-11.7h80.2v40.1H49.5z M450.5,49.5 c10.6,0,20.8,4.2,28.3,11.7c7.5,7.5,11.7,17.7,11.7,28.3v80.2h-40.1V89.6h-80.2V49.5H450.5z M49.5,330.2v80.2h80.2v40.1H49.5 c-5.3,0-10.5-1-15.4-3.1c-4.9-2-9.3-5-13-8.7c-3.7-3.7-6.7-8.2-8.7-13c-2-4.9-3-10.1-3-15.4v-80.1H49.5z M450.5,410.4v-80.2h40.1 v80.2c0,10.6-4.2,20.8-11.7,28.3c-7.5,7.5-17.7,11.7-28.3,11.7h-80.2v-40.1L450.5,410.4z"/>';

/**
 * The barcode icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const BarcodeScanner = props => <Icon content={content} {...props} viewBox="0 0 500 500" />;

export default BarcodeScanner;
