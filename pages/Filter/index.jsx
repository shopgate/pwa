import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/filter/constants/Portals';
import {
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
} from '@shopgate/pwa-common-commerce/filter/constants';
import View from 'Components/View';
import CardList from 'Components/CardList';
import PriceRangeSlider from './components/PriceRangeSlider';
import ListItem from './components/ListItem';
import ClearAllButton from './components/ClearAllButton';
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
   * Returns the currently available filters.
   * @return {Array}
   */
  get enrichedAvailableFilters() {
    // TODO: Handle other filter types (multiselect here)
    return this.props.availableFilters.map(filter => this.updateFilter(filter));
  }

  /**
   * Updates the filter.
   * @param {Object} filter The current filter.
   * @returns {Object} The updated filter.
   */
  updateFilter = (filter) => {
    const temporaryFilter = cloneDeep(this.props.temporaryFilters[filter.id]);

    switch (filter.type) {
      case FILTER_TYPE_RANGE: {
        const filterMin = Math.floor(filter.minimum / 100);
        const filterMax = Math.ceil(filter.maximum / 100);

        return {
          ...filter,
          active: temporaryFilter
            ? [temporaryFilter.minimum, temporaryFilter.maximum]
            : [filter.minimum, filter.maximum],
          handleChange: debounce((minimum, maximum) => {
            const roundedInputMin = Math.floor(minimum / 100);
            const roundedInputMax = Math.ceil(maximum / 100);

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
      case FILTER_TYPE_MULTISELECT:
        return {
          ...filter,
          url: `${filter.url}${this.props.queryParams}`,
          active: temporaryFilter ? temporaryFilter.values : null,
        };
    }
  };

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
      <View title={__('titles.filter')}>
        <div className={styles.container}>
          <CardList>
            {this.enrichedAvailableFilters.map(filter => (
              <CardList.Item key={filter.id}>
                {(filter.type === FILTER_TYPE_RANGE) && (
                  <Fragment>
                    <Portal name={portals.FILTER_PRICE_RANGE_BEFORE} props={{ filter }} />
                    <Portal name={portals.FILTER_PRICE_RANGE} props={{ filter }}>
                      <div key={filter.id} className={styles.filterContainer}>
                        <PriceRangeSlider
                          min={filter.minimum}
                          max={filter.maximum}
                          value={filter.active}
                          onChange={filter.handleChange}
                        />
                      </div>
                    </Portal>
                    <Portal name={portals.FILTER_PRICE_RANGE_AFTER} props={{ filter }} />
                  </Fragment>
                )}
                {(filter.type !== FILTER_TYPE_RANGE) && (
                  <ListItem filter={filter} key={filter.id} />
                )}
              </CardList.Item>
            ))}
          </CardList>
          <ClearAllButton isActive={hasFilters} />
        </div>
      </View>
    );
  }
}

export default connect(Filter);
