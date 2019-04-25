import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import View from 'Components/View';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from './components/Content';

const { colors } = themeConfig;

const map = {
  categoryId: 'params.categoryId',
  filters: 'state.filters',
  parentId: 'state.parentId',
  searchPhrase: 'query.s',
  visible: 'visible',
};

/**
 * The Filter page.
 */
class Filter extends PureComponent {
  /**
   * @param {Object} consumed The consumed context props.
   * @returns {JSX}
   */
  consumeRenderer = (consumed) => {
    if (!consumed.visible) {
      return null;
    }

    const {
      categoryId,
      filters,
      parentId,
      searchPhrase,
    } = consumed;

    return (
      <Content
        activeFilters={filters}
        parentId={parentId}
        {...categoryId && { categoryId }}
        {...searchPhrase && { searchPhrase }}
      />
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View background={colors.background}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Filter;
