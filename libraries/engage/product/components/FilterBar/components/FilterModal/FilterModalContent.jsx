import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import FilterPageContent from '@shopgate/engage/filter/components/FilterPageContent';
import Title from './FilterModalTitle';

const useStyles = makeStyles()(theme => ({
  root: {
    zIndex: 1,
    background: theme.palette.background.default,
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
  },
  scrollable: {
    overflow: 'auto',
    flex: 1,
  },
}));

/**
 * Filter modal content component
 * @returns {JSX.Element}
 */
const FilterModalContent = ({
  onClose,
}) => {
  const { classes } = useStyles();
  const { applyFilters, resetAllFilters } = useFilterPage();

  return (
    <div className={classes.root}>
      <Title
        apply={applyFilters}
        reset={resetAllFilters}
        close={onClose}
      />
      <div className={classes.scrollable}>
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
