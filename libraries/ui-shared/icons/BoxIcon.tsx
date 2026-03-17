import Icon from '@shopgate/pwa-common/components/Icon';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The box icon component.
 */
const Box = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.box} {...props} />
);

export default Box;
