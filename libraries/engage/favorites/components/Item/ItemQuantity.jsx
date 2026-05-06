import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@shopgate/engage/styles';
import { getWishlistItemQuantityEnabled } from '../../../core/selectors/shopSettings';

import UnitQuantityPicker from '../../../product/components/UnitQuantityPicker/UnitQuantityPicker';

const useStyles = makeStyles()({
  root: {
    width: 120,
  },
});

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => state => ({
  wishlistItemQuantityEnabled: getWishlistItemQuantityEnabled(state),
});

/**
 *
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ItemQuantity = ({
  wishlistItemQuantityEnabled,
  quantity,
  onChange,
}) => {
  const { classes } = useStyles();
  const [internalQuantity, setInternalQuantity] = useState(quantity);

  const handleChange = useCallback((newQuantity) => {
    setInternalQuantity(newQuantity);
    onChange(newQuantity);
  }, [onChange]);

  useEffect(() => {
    setInternalQuantity(quantity);
  }, [quantity]);

  if (!wishlistItemQuantityEnabled) {
    return null;
  }

  return (
    <div className={classes.root}>
      <UnitQuantityPicker
        maxValue={99}
        minValue={1}
        maxDecimals={0}
        incrementStep={1}
        decrementStep={1}
        onChange={handleChange}
        value={internalQuantity}
        toggleTabBarOnFocus
      />
    </div>
  );
};

ItemQuantity.propTypes = {
  onChange: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
  wishlistItemQuantityEnabled: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps)(ItemQuantity);
