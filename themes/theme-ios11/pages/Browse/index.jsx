import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import View from 'Components/View';
import Content from './components/Content';

const propsMap = {
  id: 'id',
  query: 'state.query',
  visible: 'visible',
};

/**
 * The Browse component.
 * @returns {JSX}
 */
const Browse = () => (
  <View noScrollOnKeyboard aria-hidden={false}>
    <Consume context={RouteContext} props={propsMap}>
      {({ visible, id, query }) => visible && <Content query={query} pageId={id} />}
    </Consume>
  </View>
);

export default Browse;
