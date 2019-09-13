import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The credit card icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CreditCard = props => <Icon content={themeConfig.icons.creditCard} {...props} />;

export default CreditCard;
