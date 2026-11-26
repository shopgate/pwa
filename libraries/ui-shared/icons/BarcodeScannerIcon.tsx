import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The barcode icon component.
 */
const BarcodeScanner = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="barcodeScanner" {...props} />
);

export default BarcodeScanner;
