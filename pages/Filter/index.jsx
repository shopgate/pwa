import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { RouteContext } from '@shopgate/pwa-common/context';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Content from '@shopgate/engage/filter/components/FilterPageContent';
import { CloseBar } from 'Components/AppBar/presets';

const { colors } = themeConfig;

const map = {
  categoryId: 'params.categoryId',
  filters: 'state.filters',
  parentRouteId: 'state.parentId',
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
      parentRouteId,
      searchPhrase,
    } = consumed;

    return (
      <Content
        AppBarComponent={CloseBar}
        activeFilters={filters}
        parentRouteId={parentRouteId}
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
      <View background={colors.background} aria-hidden={false}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Filter;
