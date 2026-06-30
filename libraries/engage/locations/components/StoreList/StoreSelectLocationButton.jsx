import React, { useContext, useCallback } from 'react';
import { RippleButton, Typography } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { isProductAvailable } from '../../helpers';
import { StoreContext } from './Store.context';
import { i18n, useWidgetSettings } from '../../../core';
import { FulfillmentContext } from '../../locations.context';
import connect from './StoreListSearch.connector';

const useStyles = makeStyles()(theme => ({
  selectLocationButtonWrapper: {
    padding: theme.spacing(0, 2, 1, 2),
  },
  selectLocationButton: {
    width: '100%',
    ':not(:disabled)': {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

/**
 * The StoreSelectLocationButton component.
 * @returns {JSX.Element}
 */
const StoreSelectLocationButton = ({ setPostalCode }) => {
  const { classes } = useStyles();
  const store = useContext(StoreContext);
  const { setUserSearchZipLocationFromSelection = true } = useWidgetSettings('@shopgate/engage/locations') || {};

  const {
    selectLocation, noInventory, isLoading, product,
  } = useContext(FulfillmentContext);

  const isAvailable = isProductAvailable(store, store?.inventory);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (noInventory || isAvailable) {
      if (setUserSearchZipLocationFromSelection) {
        setPostalCode(store.address.postalCode, product?.id);
      }
      selectLocation(store);
    }
  }, [
    isAvailable,
    noInventory,
    product,
    selectLocation,
    setPostalCode,
    setUserSearchZipLocationFromSelection,
    store,
  ]);

  return (
    <div className={classes.selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={classes.selectLocationButton}
        disabled={(isLoading || store?.isComingSoon || (!noInventory && !isAvailable))}
      >
        <Typography variant="body2" component="span" fontWeight="bold">
          {i18n.text(
            store?.isComingSoon ?
              'location.comingSoon' :
              'locations.select_location'
          )}
        </Typography>
      </RippleButton>
    </div>
  );
};

StoreSelectLocationButton.propTypes = {
  setPostalCode: PropTypes.func.isRequired,
};

const connectedStoreSelectLocationButton = connect(StoreSelectLocationButton);

export {
  connectedStoreSelectLocationButton as StoreSelectLocationButton,
};
