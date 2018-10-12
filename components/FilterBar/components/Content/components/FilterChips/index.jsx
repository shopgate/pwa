import React, { Component } from 'react';
import PropTypes from 'prop-types';
import conductor from '@virtuous/conductor';
import appConfig from '@shopgate/pwa-common/helpers/config';
import I18n from '@shopgate/pwa-common/components/I18n';
import {
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
} from '@shopgate/pwa-common-commerce/filter/constants';
import Chip from '@shopgate/pwa-ui-shared/Chip';
import ChipLayout from 'Components/ChipLayout';
import connect from './connector';
import styles from './style';

/**
 * The FilterChips component.
 */
class FilterChips extends Component {
  static propTypes = {
    openFilters: PropTypes.func.isRequired,
    routeId: PropTypes.string.isRequired,
    updateFilters: PropTypes.func.isRequired,
    currentPathname: PropTypes.string,
    filters: PropTypes.shape(),
  };

  static defaultProps = {
    currentPathname: '',
    filters: null,
  };

  /**
   * Removes the given filter id from the route state.
   * @param {string} id The id of the filter to remove.
   * @param {number} value The value to remove (multiselect).
   */
  handleRemove = (id, value) => {
    const { filters, routeId, updateFilters } = this.props;
    const { [id]: selected, ...rest } = filters;

    if (selected.type === FILTER_TYPE_MULTISELECT) {
      // Check for one key, just remove all in that case
      if (selected.value.length > 1) {
        // Remove the index from the selected filter.
        const newSelected = {
          ...selected,
          value: selected.value.filter(entry => entry.id !== value),
        };

        const newFilters = {
          ...filters,
          [id]: newSelected,
        };

        conductor.update(routeId, { filters: newFilters });
        updateFilters(newFilters);
        return;
      }
    }

    const newFilters = (Object.keys(rest).length) ? rest : null;
    conductor.update(routeId, { filters: newFilters });
    updateFilters(newFilters);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { currentPathname, filters, openFilters } = this.props;

    if (filters === null || !Object.keys(filters).length) {
      return null;
    }

    const chips = [];

    Object.keys(filters).forEach((key) => {
      const filter = filters[key];

      switch (filter.type) {
        case FILTER_TYPE_RANGE: {
          /**
           * The min and max price need to be rounded before they are passed to the I18n component,
           * since it rounds to the full nearest number when fractions are deactivated.
           */
          const [minimum, maximum] = filter.value;
          const piceMin = Math.floor(minimum / 100);
          const priceMax = Math.ceil(maximum / 100);

          chips.push((
            <Chip
              id={key}
              key={`filter-${key}`}
              onRemove={this.handleRemove}
              onClick={openFilters}
            >
              <I18n.Price price={piceMin} currency={appConfig.currency} fractions={false} />
              &nbsp;&mdash;&nbsp;
              <I18n.Price price={priceMax} currency={appConfig.currency} fractions={false} />
            </Chip>
          ));

          break;
        }
        default:
          filter.value.forEach(value => chips.push((
            <Chip
              id={value.id}
              key={`filter-${value.id}`}
              onRemove={() => this.handleRemove(filter.id, value.id)}
              onClick={openFilters}
            >
              {`${filter.label}: ${value.label}`}
            </Chip>
          )));

          break;
      }
    });

    return (
      <div className={styles}>
        <ChipLayout
          moreLabel="filter.more"
          handleMoreButton={openFilters}
          pathname={currentPathname}
        >
          {chips}
        </ChipLayout>
      </div>
    );
  }
}

export default connect(FilterChips);
