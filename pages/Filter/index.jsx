/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
import CardList from 'Components/CardList';
import PriceRangeSlider from './components/PriceRangeSlider';
import ListItem from './components/ListItem';
import ClearButton from './components/ClearButton';
import connect from './connector';
import styles from './style';

/**
 * The Search view component.
 */
class Filter extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    queryParams: PropTypes.string.isRequired,
    removeTemporaryFilter: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    availableFilters: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    availableFilters: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Updates the filter.
   * @param {Object} filter The current filter.
   * @returns {Object} The updated filter.
   */
  updateFilter = (filter) => {
    const temporaryFilter = cloneDeep(this.props.temporaryFilters[filter.id]);

    switch (filter.type) {
      case 'range': {
        const filterMin = Math.round(filter.minimum / 100);
        const filterMax = Math.round(filter.maximum / 100);

        return {
          ...filter,
          active: temporaryFilter
            ? [temporaryFilter.minimum, temporaryFilter.maximum]
            : [filter.minimum, filter.maximum],
          handleChange: debounce((minimum, maximum) => {
            const roundedInputMin = Math.round(minimum / 100);
            const roundedInputMax = Math.round(maximum / 100);

            // Check if there is a change. If not we can remove the filter again
            if (roundedInputMin <= filterMin && roundedInputMax >= filterMax) {
              this.props.removeTemporaryFilter(filter.id);
              return;
            }

            this.props.mergeTemporaryFilters({
              [filter.id]: {
                label: filter.label,
                type: filter.type,
                minimum,
                maximum,
              },
            });
          }, 300),
        };
      }
      default:
      case 'multiselect':
        return {
          ...filter,
          url: `${filter.url}${this.props.queryParams}`,
          active: temporaryFilter ? temporaryFilter.values : null,
        };
    }
  };

  /**
   * Returns the currently available filters.
   * @return {Array}
   */
  get availableFilters() {
    // TODO: Handle other filter types (multiselect here)
    return this.props.availableFilters.map(
      filter => this.updateFilter(filter)
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    // There are no available filters to show.
    if (!this.props.availableFilters) {
      return null;
    }

    const { __ } = this.context.i18n();
    const hasFilters = Object.keys(this.props.temporaryFilters).length > 0;

    return (
      <View>
        <ViewContent title={__('titles.filter')}>
          <div className={styles.container}>
            <CardList>
              {this.availableFilters.map(filter => (
                <CardList.Item>
                  {(filter.type === 'range') && (
                    <div key={filter.id} className={styles.filterContainer}>
                      <PriceRangeSlider
                        min={filter.minimum}
                        max={filter.maximum}
                        value={filter.active}
                        onChange={filter.handleChange}
                      />
                    </div>
                  )}
                  {(filter.type !== 'range') && (
                    <ListItem filter={filter} key={filter.id} />
                  )}
                </CardList.Item>
              ))}
            </CardList>
            <ClearButton hasFilters={hasFilters} />
          </div>
        </ViewContent>
      </View>
    );
  }
}

export default connect.filters(Filter);
