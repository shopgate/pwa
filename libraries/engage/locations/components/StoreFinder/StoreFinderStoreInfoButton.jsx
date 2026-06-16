import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, Typography } from '@shopgate/engage/components';
import { historyPush } from '@shopgate/engage/core';
import { connect } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import { STORE_DETAILS_PATH } from '../../constants';

const useStyles = makeStyles()(theme => ({
  showStoreInfoButton: {
    width: '100%',
    ':not(:disabled)': {
      background: `${theme.palette.primary.main} !important`,
      color: `${theme.palette.primary.contrastText} !important`,
    },
  },
  showStoreInfoButtonWrapper: {
    padding: theme.spacing(0, 2, 1, 2),
  },
}));

/**
 * @param {Function} dispatch The dispatch function.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  openStoreDetail: code => dispatch(historyPush({
    pathname: `${STORE_DETAILS_PATH}/${code}`,
  })),
});

/**
 * The StoreFinderStoreInfoButton component.
 * @param {Function} openStoreDetail The openStoreDetail function.
 * @returns {JSX}
 */
const StoreFinderStoreInfoButton = ({ openStoreDetail }) => {
  const { classes } = useStyles();
  const store = useContext(StoreContext);
  const { isLoading } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    openStoreDetail(store?.code);
  }, [openStoreDetail, store]);

  return (
    <div className={classes.showStoreInfoButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={classes.showStoreInfoButton}
        disabled={isLoading}
      >
        <Typography variant="body2" component="span">
          {i18n.text('locations.store_info')}
        </Typography>
      </RippleButton>
    </div>
  );
};

StoreFinderStoreInfoButton.propTypes = {
  openStoreDetail: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(StoreFinderStoreInfoButton);
