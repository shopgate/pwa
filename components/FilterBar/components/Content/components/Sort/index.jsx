import React from 'react';
import PropTypes from 'prop-types';
import {
  SORT_RELEVANCE,
  SORT_PRICE_ASC,
  SORT_PRICE_DESC,
} from '@shopgate/pwa-common/constants/DisplayOptions';
import SelectBox from '@shopgate/pwa-common/components/SelectBox';
import SortIcon from '@shopgate/pwa-ui-shared/icons/SortIcon';
import Item from './components/Item';
import connect from './connector';
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
 * Renders the Sort component.
 * @param {Object} props The components props.
 * @returns {JSX}
 */
const Sort = ({ changeSort, sort }) => (
  <SelectBox
    handleSelectionUpdate={newSort => changeSort(newSort, sort)}
    items={items}
    initialValue={sort}
    icon={SortIcon}
    item={Item}
    className={styles.selectBox}
    classNames={styles}
    testId="sorting"
  />
);

Sort.propTypes = {
  changeSort: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

Sort.defaultProps = {
  sort: null,
};

export default connect(Sort);
