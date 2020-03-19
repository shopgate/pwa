import React from 'react';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';

const { colors } = themeConfig;

/**
 * The Cart component.
 * @returns {JSX}
 */
const Cart = () => (
  <View background={colors.background} aria-hidden={false}>
    <Content />
  </View>
);

export default Cart;
