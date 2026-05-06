import React, { useCallback, useContext, useMemo } from 'react';
import { RippleButton } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { StoreContext } from './Store.context';
import { i18n } from '../../../core/helpers';
import { StoreFinderContext } from '../../locations.context';

const useStyles = makeStyles()(theme => ({
  selectLocationButtonWrapper: {
    padding: theme.spacing(0, 2, 1, 2),
  },
  selectLocationButton: {
    width: '100%',
    fontSize: '.875rem !important',
    ':not(:disabled)': {
      background: 'var(--color-primary)!important',
      color: 'var(--color-primary-contrast)!important',
    },
  },
}));

/**
 * The StoreFinderSelectLocationButton component.
 * Renders if route query.selectLocation param is passed
 * @returns {JSX.Element}
 */
export const StoreFinderSelectLocationButton = () => {
  const { classes } = useStyles();
  const store = useContext(StoreContext);
  const { selectLocation, isLoading, selectedLocation } = useContext(StoreFinderContext);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    selectLocation(store);
  }, [selectLocation, store]);

  const isSelected = useMemo(() =>
    selectedLocation?.code === store?.code,
  [selectedLocation, store]);

  return (
    <div className={classes.selectLocationButtonWrapper}>
      <RippleButton
        onClick={handleClick}
        className={classes.selectLocationButton}
        disabled={(isLoading || store?.isComingSoon || isSelected)}
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
