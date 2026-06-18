import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Ripple, CrossIcon, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
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
  },
  closeButton: {
    fontSize: theme.components.icon.small,
    marginRight: 12,
    cursor: 'pointer',
    color: theme.palette.primary.main,
  },
  actionButton: {
    cursor: 'pointer',
    marginLeft: 16,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
    padding: 8,
  },
  actionButtonSecondary: {
    cursor: 'pointer',
    marginLeft: 16,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    padding: 8,
  },
}));

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
      <Typography variant="h3" component="span" className={classes.title}>
        {i18n.text('titles.filter')}
      </Typography>
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
