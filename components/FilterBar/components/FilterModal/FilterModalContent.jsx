import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import FilterPageContent from '@shopgate/engage/filter/components/FilterPageContent';
import Title from './FilterModalTitle';

const { colors } = themeConfig;

const styles = {
  root: css({
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
 * Filter modal content component
 * @returns {JSX}
 */
const FilterModalContent = ({
  onClose,
}) => {
  const { applyFilters, resetAllFilters } = useFilterPage();

  return (
    <div className={styles.root}>
      <Title
        apply={applyFilters}
        reset={resetAllFilters}
        close={onClose}
      />
      <div className={styles.scrollable}>
        <FilterPageContent />
      </div>
    </div>
  );
};

FilterModalContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

FilterModalContent.defaultProps = {

};

export default FilterModalContent;
