import React from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { Section } from '@shopgate/engage/a11y/components';
import ProductUnitQuantityPicker from './ProductUnitQuantityPicker';
import OrderQuantityHint from '../OrderQuantityHint';

const styles = {
  quantityPicker: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  }).toString(),
  quantityHint: css({
    marginBottom: -4,
  }).toString(),
};

/**
 * A Quantity Picker with unit support.
 * @returns {JSX.Element}
 */
const UnitQuantityPickerWithSection = ({
  productId,
  variantId,
}) => {
  const { show = hasNewServices() } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker');

  if (!show) {
    return null;
  }

  return (
    <Section title="product.sections.quantity">
      <ProductUnitQuantityPicker className={styles.quantityPicker}>
        <OrderQuantityHint
          productId={variantId || productId}
          className={styles.quantityHint}
        />
      </ProductUnitQuantityPicker>
    </Section>
  );
};

UnitQuantityPickerWithSection.propTypes = {
  productId: PropTypes.string,
  variantId: PropTypes.string,
};

UnitQuantityPickerWithSection.defaultProps = {
  productId: null,
  variantId: null,
};

export default UnitQuantityPickerWithSection;
