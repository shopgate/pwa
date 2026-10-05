import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { router } from '@shopgate/pwa-common/helpers/router';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_VARIANT_SELECT,
  PRODUCT_VARIANT_SELECT_AFTER,
  PRODUCT_VARIANT_SELECT_BEFORE,
} from '@shopgate/engage/product/constants';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { VariantSelector } from '../VariantSelector';

/**
 * Shows the selected variant on the current product page.
 * @param {string} productId The ID of the variant.
 */
const navigate = (productId) => {
  const route = router.getCurrentRoute();
  router.update(route.id, { productId });
};

/**
 * The Characteristics component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Characteristics = ({ productId, variantId }) => {
  const consumeRenderer = useCallback(({
    conditioner,
    setCharacteristics,
    characteristics,
  }) => (
    <VariantSelector
      productId={productId}
      variantId={variantId}
      onVariantSelected={navigate}
      finishTimeout={200}
      conditioner={conditioner}
      characteristics={characteristics}
      onCharacteristicsChange={setCharacteristics}
    />
  ), [productId, variantId]);

  return (
    <>
      <Portal name={PRODUCT_VARIANT_SELECT_BEFORE} />
      <Portal name={PRODUCT_VARIANT_SELECT}>
        <ProductContext.Consumer>
          {consumeRenderer}
        </ProductContext.Consumer>
      </Portal>
      <Portal name={PRODUCT_VARIANT_SELECT_AFTER} />
    </>
  );
};

Characteristics.propTypes = {
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

Characteristics.defaultProps = {
  productId: null,
  variantId: null,
};

export default Characteristics;
