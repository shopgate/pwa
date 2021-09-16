import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { SurroundPortals } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { PRODUCT_UNIT_QUANTITY_PICKER, ProductContext } from '@shopgate/engage/product';
import { withCurrentProduct, useWidgetSettings } from '@shopgate/engage/core';
import UnitQuantityPicker from './UnitQuantityPicker';
import connect from './ProductUnitQuantityPicker.connector';

const { variables } = themeConfig;

const styles = {
  root: css({
    marginBottom: variables.gap.small,
    marginTop: '0px',
    justifyContent: 'space-evenly',
  }).toString(),
  qtyContainer: css({
    marginBottom: variables.gap.small,
  }).toString(),
  qtyWrapper: css({
    width: '100%',
    padding: '0',
  }).toString(),
};

/**
 * Renders the quantity picker enriched with current product data.
 * @param {Object} props Props
 * @returns {JSX}
 */
const ProductUnitQuantityPicker = ({
  children, className, product, disabled, stockInfo,
}) => {
  const { show = false } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker') || {};

  if (!show) {
    return null;
  }

  const { quantity, setQuantity } = useContext(ProductContext);

  const { minValue, maxValue } = useMemo(() => {
    let min;
    let max;

    if (stockInfo) {
      if (stockInfo.minOrderQuantity > 0) {
        min = stockInfo.minOrderQuantity;
      }

      if (stockInfo.maxOrderQuantity > 0) {
        max = stockInfo.maxOrderQuantity;
      }
    }

    return {
      minValue: min,
      maxValue: max,
    };
  }, [stockInfo]);

  /**
   * Validates an value based on minValue & maxValue and corrects it if necessary
   * @param {number} val The value to be tested / adjusted
   * @returns {number}
   */
  const validateQuantity = (val) => {
    if (minValue && val < minValue) return minValue;
    if (maxValue && val > maxValue) return maxValue;
    return val;
  };

  useEffect(() => {
    const validatedQuantity = validateQuantity(quantity);
    if (validatedQuantity !== quantity) {
      setQuantity(validatedQuantity);
    }
  }, [quantity, minValue, maxValue, validateQuantity, setQuantity]);

  if (!product) {
    return null;
  }

  const { unit, hasCatchWeight } = product;
  const hasUnitWithDecimals = (unit && hasCatchWeight) || false;

  return (
    <SurroundPortals portalName={PRODUCT_UNIT_QUANTITY_PICKER}>
      <div className={classNames(styles.root, className)}>
        <div className={styles.qtyWrapper}>
          <UnitQuantityPicker
            className={styles.qtyContainer}
            unit={hasUnitWithDecimals ? unit : null}
            maxDecimals={hasUnitWithDecimals ? 2 : 0}
            incrementStep={hasUnitWithDecimals ? 0.25 : 1}
            decrementStep={hasUnitWithDecimals ? 0.25 : 1}
            onChange={value => setQuantity(value)}
            value={quantity}
            disabled={disabled}
            minValue={minValue}
            maxValue={maxValue}
          />
        </div>
        { children && (
          <div>
            { children}
          </div>
        )}
      </div>
    </SurroundPortals>
  );
};

ProductUnitQuantityPicker.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  product: PropTypes.shape(),
  stockInfo: PropTypes.shape(),
};

ProductUnitQuantityPicker.defaultProps = {
  disabled: false,
  product: null,
  stockInfo: null,
  children: null,
  className: null,
};

export default withCurrentProduct(connect(ProductUnitQuantityPicker));
