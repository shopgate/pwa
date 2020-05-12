import React, {
  useState, useCallback, useContext,
} from 'react';
import { css } from 'glamor';
import { Modal, Backdrop } from '@shopgate/engage/components';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RouteContext } from '@shopgate/pwa-common/context';
import { useFilterBarContext } from '../../FilterBarProvider.context';
import FilterContent from '../../../../pages/Filter/components/Content';
import Title from './FilterModalTitle';

const { colors } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }),
  content: css({
    zIndex: 1,
    background: colors.light,
    borderRadius: 4,
    minWidth: 300,
    [responsiveMediaQuery('>=md')]: {
      minWidth: 600,
    },
    maxWidth: '50%',
    minHeight: 300,
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  scrollable: css({
    overflow: 'auto',
    flex: 1,
  }),
};

/**
 * Filter modal
 * @returns {JSX}
 */
const FilterModal = () => {
  const {
    filterModalOpen,
    setFilterModalOpen,
    filters,
    applyFilters,
    resetFilters,
  } = useFilterBarContext();

  const {
    id,
    params: {
      categoryId,
    } = {},
    query: {
      s: searchPhrase,
    } = {},
  } = useContext(RouteContext);

  const [filterState, setFilterState] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleApply = useCallback(() => {
    applyFilters(id, filterState.filters, filterState.currentFilters);
  }, [applyFilters, filterState?.currentFilters, filterState?.filters, id]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleReset = useCallback(() => {
    resetFilters(id);
  }, [id, resetFilters]);

  const handleClose = useCallback(() => {
    setFilterModalOpen(false);
  }, [setFilterModalOpen]);

  if (!filterModalOpen) {
    return null;
  }

  return (
    <Modal>
      <div className={styles.root}>
        <Backdrop
          isVisible
          level={0}
          opacity={38}
          onClick={() => setFilterModalOpen(false)}
        />
        <div className={styles.content}>
          <Title
            apply={handleApply}
            reset={handleReset}
            close={handleClose}
          />
          <div className={styles.scrollable}>
            <FilterContent
              parentId="0"
              showAppBar={false}
              onChange={setFilterState}
              activeFilters={filters}
              categoryId={categoryId}
              searchPhrase={searchPhrase}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
