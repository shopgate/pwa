import React from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import colors from 'Styles/colors';
import Content from './components/Content';

const map = {
  categoryId: 'params.categoryId',
  filters: 'state.filters',
  searchPhrase: 'query.s',
  visible: 'visible',
};

/**
 * @returns {JSX}
 */
const Filter = () => (
  <View background={colors.background}>
    <Consume context={RouteContext} props={map}>
      {(consumed) => {
        const {
          categoryId,
          filters,
          searchPhrase,
          visible,
        } = consumed;

        return visible && (
          <Content
            activeFilters={filters}
            {...categoryId && { categoryId }}
            {...searchPhrase && { searchPhrase }}
          />
        );
      }}
    </Consume>
  </View>
);

export default Filter;
