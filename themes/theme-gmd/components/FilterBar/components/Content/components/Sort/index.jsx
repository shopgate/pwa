import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  parseObjectToQueryString,
  SORT_RELEVANCE,
  SORT_PRICE_ASC,
  SORT_PRICE_DESC,
  DEFAULT_SORT,
} from '@shopgate/engage/core';
import {
  SelectBox,
  ArrowDropIcon,
} from '@shopgate/engage/components';

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
 * The Sort component.
 */
class Sort extends PureComponent {
  static propTypes = {
    historyReplace: PropTypes.func.isRequired,
    route: PropTypes.shape().isRequired,
  }

  /**
   * @param {string} sort The new sort string.
   */
  handleSelection = (sort) => {
    const { route } = this.props;

    if (route.query.sort === sort) {
      return;
    }

    const query = parseObjectToQueryString({
      ...route.query,
      sort,
    });
    const pathname = `${route.pathname}${query}`;

    this.props.historyReplace({
      pathname,
      state: route.state,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { route } = this.props;

    return (
      <SelectBox
        handleSelectionUpdate={this.handleSelection}
        items={items}
        initialValue={route.query.sort || DEFAULT_SORT}
        icon={ArrowDropIcon}
        item={Item}
        className={styles.selectBox}
        classNames={styles}
        testId="sorting"
      />
    );
  }
}

export default connect(Sort);
