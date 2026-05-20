import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The arrow-drop icon component.
 */
const ArrowDrop = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.arrowDrop} {...props} />);

export default ArrowDrop;
