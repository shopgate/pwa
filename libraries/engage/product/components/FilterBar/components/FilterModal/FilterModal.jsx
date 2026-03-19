import React, {
  useCallback, useContext,
} from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Modal, Backdrop } from '@shopgate/engage/components';
import { RouteContext } from '@shopgate/pwa-common/context';
import { FilterPageProvider } from '@shopgate/engage/filter/providers';
import { useFilterBarContext } from '../../FilterBarProvider.context';
import Content from './FilterModalContent';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

/**
 * Filter modal
 * @returns {JSX}
 */
const FilterModal = () => {
  const { classes } = useStyles();
  const {
    filterModalOpen,
    setFilterModalOpen,
    filters,
    updateFilters,
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

  const handleClose = useCallback(() => {
    setFilterModalOpen(false);
  }, [setFilterModalOpen]);

  const handleApply = useCallback((update) => {
    handleClose();
    updateFilters(update);
  }, [handleClose, updateFilters]);

  if (!filterModalOpen) {
    return null;
  }

  return (
    <Modal>
      <div className={classes.root}>
        <Backdrop
          isVisible
          level={0}
          opacity={38}
          onClick={() => setFilterModalOpen(false)}
        />

        <FilterPageProvider
          parentRouteId={id}
          activeFilters={filters}
          categoryId={categoryId}
          searchPhrase={searchPhrase}
          onApply={handleApply}
        >
          <Content onClose={handleClose} />
        </FilterPageProvider>
      </div>
    </Modal>
  );
};

export default FilterModal;
