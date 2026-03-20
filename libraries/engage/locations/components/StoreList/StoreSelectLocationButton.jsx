import React, { useContext, useCallback } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { isProductAvailable } from '../../helpers';
import { StoreContext } from './Store.context';
import { i18n, useWidgetSettings } from '../../../core';
import { FulfillmentContext } from '../../locations.context';
import connect from './StoreListSearch.connector';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  selectLocationButtonWrapper: {
    padding: `0 ${gap.big}px ${gap.small}px ${gap.big}px`,
  },
  selectLocationButton: {
    width: '100%',
    fontSize: '.875rem !important',
    ':not(:disabled)': {
      background: 'var(--color-primary)!important',
      color: 'var(--color-primary-contrast)!important',
    },
  },
});

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
        {i18n.text(
          store?.isComingSoon ?
            'location.comingSoon' :
            'locations.select_location'
        )}
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
