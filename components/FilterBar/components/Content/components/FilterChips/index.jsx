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
   * @param {number} index The index of the value to remove (multiselect).
   */
  handleRemove = (id, index = null) => {
    const { filters, routeId } = this.props;
    const { [id]: filterId, ...rest } = filters;

    if (filters[id].type === FILTER_TYPE_MULTISELECT) {
      // Check for one key, just remove all in that case
      // remove index from key, if it exists
    }

    const newFilters = (Object.keys(rest).length) ? rest : null;
    conductor.update(routeId, { filters: newFilters });
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
        case FILTER_TYPE_MULTISELECT:
          filter.value.forEach((value, index) => chips.push((
            <Chip
              id={filter.id}
              key={`filter-${key}`}
              onRemove={id => this.handleRemove(id, index)}
              onClick={openFilters}
            >
              {`${filter.label}: ${value}`}
            </Chip>
          )));
          break;
        default:
          chips.push((
            <Chip
              id={filter.id}
              key={`filter-${key}`}
              onRemove={this.handleRemove}
              onClick={openFilters}
            >
              {`${filter.label}: ${filter.value}`}
            </Chip>
          ));
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
