/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import I18n from '@shopgate/pwa-common/components/I18n';
import View from 'Components/View';
import ViewContent from 'Components/ViewContent';
import CardList from 'Components/CardList';
import Button from 'Components/Button';
import PriceRangeSlider from './components/PriceRangeSlider';
import FilterListItem from './components/FilterListItem';
import connect from './connector';
import styles from './style';

/**
 * The Search view component.
 */
class Filter extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    queryParams: PropTypes.string.isRequired,
    removeAllTemporaryFilters: PropTypes.func.isRequired,
    removeTemporaryFilter: PropTypes.func.isRequired,
    setFilterClosed: PropTypes.func.isRequired,
    setFilterOpened: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    availableFilters: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    activeFilters: {},
    availableFilters: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

 /**
  * Marks the filter page as open when entering the page.
  */
  componentDidMount() {
    this.props.setFilterOpened();
  }

 /**
  * Marks the filter page as closed when leaving the page.
  */
  componentWillUnmount() {
    this.props.setFilterClosed();
  }

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
                    <FilterListItem
                      href={filter.url}
                      label={filter.label}
                      values={filter.active}
                      onClear={filterId => this.props.removeTemporaryFilter(filterId)}
                      key={filter.id}
                    />
                  )}
                </CardList.Item>
              ))}
            </CardList>
            <div className={styles.clearBtn}>
              <Button
                flat
                type="regular"
                onClick={() => this.props.removeAllTemporaryFilters()}
                disabled={!hasFilters}
              >
                <I18n.Text string="filter.clear_all" />
              </Button>
            </div>
          </div>
        </ViewContent>
      </View>
    );
  }
}

export default connect.filters(Filter);
