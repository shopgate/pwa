import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import { View } from '@shopgate/engage/components';
import Content from './components/Content';

const propsMap = {
  visible: 'visible',
};

/**
 * The Browse component.
 * @returns {JSX}
 */
const Browse = () => (
  <View noScrollOnKeyboard aria-hidden={false}>
    <Consume context={RouteContext} props={propsMap}>
      {({ visible }) => visible && <Content />}
    </Consume>
  </View>
);

export default Browse;
