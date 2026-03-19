import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { Ripple, CrossIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    flexDirection: 'row',
    margin: 16,
    borderBottom: '1px solid rgba(0, 0, 0, 0.24)',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: '1.25rem',
  },
  closeButton: {
    fontSize: 21,
    marginRight: 12,
    cursor: 'pointer',
    color: 'var(--color-primary)',
  },
  actionButton: {
    cursor: 'pointer',
    marginLeft: 16,
    color: 'var(--color-primary)',
    fontWeight: '600',
    padding: 8,
  },
  actionButtonSecondary: {
    cursor: 'pointer',
    marginLeft: 16,
    color: 'var(--color-primary)',
    fontWeight: '500',
    padding: 8,
  },
});

/**
 * Filter Modal Title
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const FilterModalTitle = ({ apply, reset, close }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Ripple onClick={close} className={classes.closeButton}>
        <CrossIcon />
      </Ripple>
      <span className={classes.title}>
        {i18n.text('titles.filter')}
      </span>
      <Ripple fill className={classes.actionButtonSecondary} onClick={reset}>
        {i18n.text('filter.reset')}
      </Ripple>
      <Ripple fill className={classes.actionButton} onClick={apply}>
        {i18n.text('filter.apply')}
      </Ripple>
    </div>
  );
};

FilterModalTitle.propTypes = {
  apply: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default FilterModalTitle;
