import React from 'react';
import PropTypes from 'prop-types';
import { BackInStockButton } from '@shopgate/engage/back-in-stock/components';
import { withCurrentProduct } from '@shopgate/engage/core';
import connect from './connector';

/**
 * The CharacteristicsButton component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackInStockEnabled Whether the back in stock feature is enabled
 * @param {Object} props.variant The variant for this entry
 * @param {Object} props.subscription The subscription
 * @return {JSX}
 */
const CharacteristicsButton = ({
  isBackInStockEnabled,
  subscription,
  variant,
}) => {
  const productIsNotAVariant = !variant;
  const featureIsNotEnabled = !isBackInStockEnabled;
  const productIsNotAvailable = variant?.stock?.quantity === 0 &&
    variant?.stock?.ignoreQuantity === false;

  if (productIsNotAVariant || featureIsNotEnabled || !productIsNotAvailable) return null;

  return (
    <BackInStockButton
      subscription={subscription}
      stopPropagation
      productId={variant.id}
      alignRight
    />
  );
};

CharacteristicsButton.propTypes = {
  isBackInStockEnabled: PropTypes.bool.isRequired,
  subscription: PropTypes.shape(),
  variant: PropTypes.shape(),
};

CharacteristicsButton.defaultProps = {
  variant: {},
  subscription: null,
};

export default withCurrentProduct(connect(CharacteristicsButton));
