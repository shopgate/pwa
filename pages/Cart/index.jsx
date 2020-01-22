import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import View from 'Components/View';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';

const { colors } = themeConfig;

const propsMap = {
  visible: 'visible',
};

/**
 * The Cart component.
 * @returns {JSX}
 */
const Cart = () => (
  <View background={colors.background} aria-hidden={false}>
    <Consume context={RouteContext} props={propsMap}>
      {({ visible }) => visible && <Content />}
    </Consume>
  </View>
);

export default Cart;
