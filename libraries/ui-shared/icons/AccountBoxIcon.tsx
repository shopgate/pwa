import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The account box icon component.
 */
const AccountBox = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.accountBox} {...props} />);

export default AccountBox;
