import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The add more icon component.
 */
const AddMore = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.addMore} {...props} />);

export default AddMore;
