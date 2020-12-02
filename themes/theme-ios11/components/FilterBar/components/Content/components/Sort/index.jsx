import React from 'react';
import SelectBox from '@shopgate/pwa-common/components/SelectBox';
import ArrowDropIcon from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import { SurroundPortals } from '@shopgate/engage/components';
import { FILTER_SORT_OPTIONS, useSort } from '@shopgate/engage/filter';
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
    <SurroundPortals portalName={FILTER_SORT_OPTIONS} portalProps={{ items: options }}>
      <SelectBox
        handleSelectionUpdate={updateRoute}
        items={options}
        initialValue={activeOption}
        icon={ArrowDropIcon}
        item={Item}
        className={styles.selectBox}
        classNames={styles}
        testId="sorting"
      />
    </SurroundPortals>
  );
};

export default Sort;
