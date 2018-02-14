/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import {
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
} from '@shopgate/pwa-common-commerce/filter/constants';
import Chip from 'Components/Chip';
import ChipLayout from 'Components/ChipLayout';
import connect from './connector';
import styles from './style';

/**
 * The Filter Bar Filter Chips component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FilterChips = ({
  activeFilters,
  currency,
  handleFilterRemove,
  handleOpenFilters,
}) => {
  if (activeFilters === null || !Object.keys(activeFilters).length) {
    return null;
  }

  const chips = [];

  Object.keys(activeFilters).forEach((key) => {
    const filter = activeFilters[key];

    switch (filter.type) {
      case FILTER_TYPE_RANGE: {
        /**
         * The min and max price need to be rounded before they are passed to the I18n component,
         * since it rounds to the full nearest number when fractions are deactivated.
         */
        const piceMin = Math.floor(filter.minimum / 100);
        const priceMax = Math.ceil(filter.maximum / 100);

        chips.push((
          <Chip
            key={filter.label}
            onRemove={() => handleFilterRemove(key)}
            onClick={handleOpenFilters}
          >
            <I18n.Price price={piceMin} currency={currency} fractions={false} />
            &nbsp;&mdash;&nbsp;
            <I18n.Price price={priceMax} currency={currency} fractions={false} />
          </Chip>
        ));

        break;
      }
      case FILTER_TYPE_MULTISELECT:
        filter.values.forEach((value, index) => chips.push((
          <Chip
            key={`${filter.label}-${index + 1}`}
            onRemove={() => handleFilterRemove(key, index)}
            onClick={handleOpenFilters}
          >
            {`${filter.label}: ${value}`}
          </Chip>
        )));
        break;
      default:
        chips.push((
          <Chip
            key={filter.label}
            onRemove={() => handleFilterRemove(key)}
            onClick={handleOpenFilters}
          >
            {`${filter.label}: ${filter.value}`}
          </Chip>
        ));
        break;
    }
  });

  return (
    <div className={styles}>
      <ChipLayout moreLabel="filter.more" handleMoreButton={handleOpenFilters}>
        {chips}
      </ChipLayout>
    </div>
  );
};

FilterChips.propTypes = {
  activeFilters: PropTypes.shape(),
  currency: PropTypes.string,
  handleFilterRemove: PropTypes.func,
  handleOpenFilters: PropTypes.func,
};

FilterChips.defaultProps = {
  activeFilters: null,
  currency: '',
  handleFilterRemove: () => {},
  handleOpenFilters: () => {},
};

export default connect(FilterChips);
