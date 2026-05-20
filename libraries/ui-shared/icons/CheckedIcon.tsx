import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The checked icon component.
 */
const Checked = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.checked} {...props} />);

export default Checked;
