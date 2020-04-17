import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { ProductContext } from '@shopgate/engage/product';
import { withCurrentProduct } from '@shopgate/engage/core';
import UnitQuantityPicker from './UnitQuantityPicker';
import connect from './ProductUnitQuantityPicker.connector';
import { PRODUCT_UNIT_EACH } from '../../constants';

const { variables } = themeConfig;

const styles = {
  root: css({
    margin: variables.gap.big,
  }).toString(),
  title: css({
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
  }).toString(),
  small: css({
    width: 120,
  }).toString(),
  big: css({
    width: 170,
  }).toString(),
};

/**
 * Renders the quantity picker enriched with current product data.
 * @param {Object} props Props
 * @returns {JSX}
 */
const ProductUnitQuantityPicker = ({ product }) => {
  const { quantity, setQuantity } = useContext(ProductContext);

  if (!product) {
    return null;
  }

  const { unit } = product;
  const hasUnitWithDecimals = unit && unit !== PRODUCT_UNIT_EACH;

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.title}>
        <I18n.Text string="product.sections.quantity" />
      </div>
      <UnitQuantityPicker
        className={hasUnitWithDecimals ? styles.big : styles.small}
        unit={hasUnitWithDecimals ? unit : null}
        maxDecimals={hasUnitWithDecimals ? 2 : 0}
        incrementStep={hasUnitWithDecimals ? 0.25 : 1}
        decrementStep={hasUnitWithDecimals ? 0.25 : 1}
        onChange={setQuantity}
        value={quantity}
      />
    </div>
  );
};

ProductUnitQuantityPicker.propTypes = {
  product: PropTypes.shape(),
};

ProductUnitQuantityPicker.defaultProps = {
  product: null,
};

export default withCurrentProduct(connect(ProductUnitQuantityPicker));
