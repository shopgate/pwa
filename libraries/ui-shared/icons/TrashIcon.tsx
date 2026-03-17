import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The trash icon component.
 */
const Trash = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.trash} {...props} />);

export default Trash;
