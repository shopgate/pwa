import React from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/engage';
import { useWidgetSettings } from '../../../core';
import { ProductUnitQuantityPicker } from './index';
import { OrderQuantityHint } from '../../index';
import { Section } from '../../../a11y';

const { variables } = themeConfig;

const styles = {
  quantityPicker: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: variables.gap.big,
  }).toString(),
  quantityHint: css({
    marginBottom: -4,
    paddingLeft: 16,
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
  const { show = false } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker') || {};

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
