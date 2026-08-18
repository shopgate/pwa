import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@shopgate/engage/components/v2';
import { historyPush } from '@shopgate/engage/core';
import { connect } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core';
import { StoreFinderContext } from '../../locations.context';
import { STORE_DETAILS_PATH } from '../../constants';

const useStyles = makeStyles()(theme => ({
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
      <Button
        color="primary"
        size="small"
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
      >
        {i18n.text('locations.store_info')}
      </Button>
    </div>
  );
};

StoreFinderStoreInfoButton.propTypes = {
  openStoreDetail: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(StoreFinderStoreInfoButton);
