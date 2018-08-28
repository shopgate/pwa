import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import Content from './components/Content';

const map = {
  categoryId: 'params.categoryId',
  searchPhrase: 'query.s',
  visible: 'visible',
};

/**
 * @returns {JSX}
 */
const Filter = () => (
  <View>
    <Consume context={RouteContext} props={map}>
      {({ categoryId, searchPhrase, visible }) => (
        visible && (
          <Content
            {...categoryId && { categoryId }}
            {...searchPhrase && { searchPhrase }}
          />
        )
      )}
    </Consume>
  </View>
);

export default Filter;
