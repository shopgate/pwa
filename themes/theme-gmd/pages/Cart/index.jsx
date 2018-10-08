import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@virtuous/react-conductor/Router/context';
import View from 'Components/View';
import colors from 'Styles/colors';
import Content from './components/Content';

const propsMap = {
  visible: 'visible',
};

/**
 * The Cart component.
 * @returns {JSX}
 */
const Cart = () => (
  <View background={colors.background}>
    <Consume context={RouteContext} props={propsMap}>
      {({ visible }) => visible && <Content />}
    </Consume>
  </View>
);

export default Cart;
