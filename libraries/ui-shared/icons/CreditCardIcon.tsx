import React from 'react';
import type { IconProps } from '@shopgate/pwa-common/components/Icon';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The credit card icon component.
 */
const CreditCard = (props: Omit<IconProps, 'content'>) => (
  <Icon content={themeConfig.icons.creditCard} {...props} />);

export default CreditCard;
