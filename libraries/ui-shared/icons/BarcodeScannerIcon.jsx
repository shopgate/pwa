import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The barcode icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const BarcodeScanner = props => <Icon content={themeConfig.icons.barcodeScanner} {...props} viewBox="0 0 500 500" />;

export default BarcodeScanner;
