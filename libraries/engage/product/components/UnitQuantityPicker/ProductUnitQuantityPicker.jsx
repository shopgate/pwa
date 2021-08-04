import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { SurroundPortals } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { PRODUCT_UNIT_QUANTITY_PICKER, ProductContext } from '@shopgate/engage/product';
import { withCurrentProduct } from '@shopgate/engage/core';
import UnitQuantityPicker from './UnitQuantityPicker';
import connect from './ProductUnitQuantityPicker.connector';
import { small, big } from './styles';

const { variables } = themeConfig;

const styles = {
  root: css({
    margin: variables.gap.small,
    marginTop: '0px',
    justifyContent: 'space-evenly',
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

  if (!product) {
    return null;
  }

  const { unit, hasCatchWeight } = product;
  const hasUnitWithDecimals = (unit && hasCatchWeight) || false;

  return (
    <SurroundPortals portalName={PRODUCT_UNIT_QUANTITY_PICKER}>
      <div className={classNames(styles.root, className)}>
        <div>
          <UnitQuantityPicker
            className={hasUnitWithDecimals ? big : small}
            unit={hasUnitWithDecimals ? unit : null}
            maxDecimals={hasUnitWithDecimals ? 2 : 0}
            incrementStep={hasUnitWithDecimals ? 0.25 : 1}
            decrementStep={hasUnitWithDecimals ? 0.25 : 1}
            onChange={setQuantity}
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
