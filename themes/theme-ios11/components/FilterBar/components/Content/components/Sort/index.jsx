import React from 'react';
import SelectBox from '@shopgate/pwa-common/components/SelectBox';
import ArrowDropIcon from '@shopgate/pwa-ui-shared/icons/ArrowDropIcon';
import { useSort } from '@shopgate/engage/filter';
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
  );
};

export default Sort;
