import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The barcode icon component.
 */
const BarcodeScanner = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.barcodeScanner} {...props} />);

export default BarcodeScanner;
