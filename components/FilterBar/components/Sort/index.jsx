import React from 'react';
import PropTypes from 'prop-types';
import {
  SORT_RELEVANCE,
  SORT_PRICE_ASC,
  SORT_PRICE_DESC,
} from '@shopgate/pwa-common/constants/DisplayOptions';
import SelectBox from '@shopgate/pwa-common/components/SelectBox';
import Ripple from 'Components/Ripple';
import ArrowDropIcon from 'Components/icons/ArrowDropIcon';
import styles from './style';

const items = [
  {
    label: 'filter.sort.most_popular',
    value: SORT_RELEVANCE,
  },
  {
    label: 'filter.sort.price_desc',
    value: SORT_PRICE_DESC,
  },
  {
    label: 'filter.sort.price_asc',
    value: SORT_PRICE_ASC,
  },
];

/**
 * Renders the FilterBarSort component.
 * @param {Object} props The components props.
 * @param {Function} props.handleSelectionUpdate Callback that is executed when selection changed.
 * @returns {JSX}
 */
const FilterBarSort = ({ children, handleSelectionUpdate, hasFilters, sort }) => {
  const newStyles = { ...styles };

  if (hasFilters) {
    newStyles.button = `${newStyles.button} ${newStyles.buttonActive}`;
  }

  const Item = (
    <Ripple rt-stateless fill className={styles.selectRipple}>
      {children}
    </Ripple>
  );

  return (
    <SelectBox
      items={items}
      initialValue={sort}
      handleSelectionUpdate={handleSelectionUpdate}
      icon={ArrowDropIcon}
      item={Item}
      className={styles.selectBox}
      classNames={styles}
    />
  );
};

FilterBarSort.propTypes = {
  children: PropTypes.element.isRequired,
  handleSelectionUpdate: PropTypes.func.isRequired,
  hasFilters: PropTypes.bool,
  sort: PropTypes.string,
};

FilterBarSort.defaultProps = {
  sort: null,
  hasFilters: false,
};

export default FilterBarSort;
