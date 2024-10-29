import React from 'react';
import { SelectBox, ArrowDropIcon, SurroundPortals } from '@shopgate/engage/components';
import { useSort, PORTAL_FILTER_SORT_OPTIONS } from '@shopgate/engage/filter';
import Item from './components/Item';
import styles from './style';

/**
 * The Sort component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Sort = () => {
  const { activeOption, options, updateRoute } = useSort();

  return (
    <SurroundPortals portalName={PORTAL_FILTER_SORT_OPTIONS} portalProps={{ items: options }}>
      <SelectBox
        handleSelectionUpdate={updateRoute}
        items={options}
        initialValue={activeOption}
        icon={ArrowDropIcon}
        item={Item}
        className={`${styles.selectBox} theme__filter-bar__sort`}
        classNames={styles}
        testId="sorting"
      />
    </SurroundPortals>
  );
};

export default Sort;
