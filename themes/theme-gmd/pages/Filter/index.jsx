import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { CATEGORY_ALL_FILTER_PATTERN } from '@shopgate/engage/category/constants';
import { buildFilterParamsForFetchFiltersRequest } from '@shopgate/engage/filter/helpers';
import { RouteContext } from '@shopgate/pwa-common/context';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { View } from '@shopgate/engage/components';
import Content from '@shopgate/engage/filter/components/FilterPageContentWithProvider';
import { CloseBar } from 'Components/AppBar/presets';

const { colors } = themeConfig;

const map = {
  categoryId: 'params.categoryId',
  filters: 'state.filters',
  parentRouteId: 'state.parentId',
  searchPhrase: 'query.s',
  visible: 'visible',
  pattern: 'pattern',
};

/**
 * The Filter page.
 */
class Filter extends PureComponent {
  /**
   * @param {Object} consumed The consumed context props.
   * @returns {JSX.Element}
   */
  consumeRenderer = (consumed) => {
    if (!consumed.visible) {
      return null;
    }

    const {
      categoryId,
      filters,
      parentRouteId,
      searchPhrase,
      pattern,
    } = consumed;

    return (
      <Content
        AppBarComponent={CloseBar}
        activeFilters={filters}
        parentRouteId={parentRouteId}
        {...pattern !== CATEGORY_ALL_FILTER_PATTERN ? {
          ...categoryId && { categoryId },
          ...searchPhrase && { searchPhrase },
        } : {
          searchPhrase: '*',
          filters: buildFilterParamsForFetchFiltersRequest(filters),
        }}
      />
    );
  };

  /**
   * @returns {JSX.Element}
   */
  render() {
    return (
      <View background={colors.background} aria-hidden={false}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Filter;
