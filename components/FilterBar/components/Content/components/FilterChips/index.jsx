import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Chip } from '@shopgate/engage/components';
import { FILTER_TYPE_RANGE, FILTER_TYPE_MULTISELECT } from '@shopgate/engage/filter';
import { i18n } from '@shopgate/engage/core';
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
    scrollTop: PropTypes.func,
  };

  static defaultProps = {
    currentPathname: '',
    filters: null,
    scrollTop: () => { },
  };

  /**
   * Removes the given filter id from the route state.
   * @param {string} id The id of the filter to remove.
   * @param {number} value The value to remove (multiselect).
   */
  handleRemove = (id, value) => {
    const {
      filters, routeId, updateFilters, scrollTop,
    } = this.props;
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

        router.update(routeId, { filters: newFilters });
        updateFilters(newFilters);
        scrollTop();
        return;
      }
    }

    const newFilters = (Object.keys(rest).length) ? rest : null;
    router.update(routeId, { filters: newFilters });
    updateFilters(newFilters);
    scrollTop();
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
          const priceMin = Math.floor(minimum / 100);
          const priceMax = Math.ceil(maximum / 100);
          const fromPrice = i18n.price(priceMin, appConfig.currency, false);
          const toPrice = i18n.price(priceMax, appConfig.currency, false);
          const pricesFormatted = `${fromPrice} - ${toPrice}`;
          const labelValue = i18n.text('price.range', {
            fromPrice,
            toPrice,
          });
          const removeLabel = i18n.text('filter.remove', { filter: labelValue });
          const editLabel = i18n.text('filter.edit', { filter: labelValue });

          chips.push((
            <Chip
              id={key}
              key={`filter-${key}`}
              onRemove={this.handleRemove}
              onClick={openFilters}
              removeLabel={removeLabel}
              editLabel={editLabel}
            >
              {pricesFormatted}
            </Chip>
          ));

          break;
        }
        default:
          filter.value.forEach((value) => {
            const filterFormatted = `${filter.label}: ${value.label}`;
            const removeLabel = i18n.text('filter.remove', { filter: filterFormatted });
            const editLabel = i18n.text('filter.edit', { filter: filterFormatted });

            chips.push((
              <Chip
                id={value.id}
                key={`filter-${value.id}`}
                onRemove={() => this.handleRemove(filter.id, value.id)}
                onClick={openFilters}
                removeLabel={removeLabel}
                editLabel={editLabel}
              >
                {filterFormatted}
              </Chip>
            ));
          });

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
