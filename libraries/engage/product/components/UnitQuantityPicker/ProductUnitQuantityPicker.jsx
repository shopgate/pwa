import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/engage';
import { PRODUCT_UNIT_QUANTITY_PICKER, ProductContext } from '@shopgate/engage/product';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { withCurrentProduct } from '@shopgate/engage/core/hocs';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import UnitQuantityPicker from './UnitQuantityPicker';
import connect from './ProductUnitQuantityPicker.connector';
import { small, big } from './styles';

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
};

/**
 * Renders the quantity picker enriched with current product data.
 * @param {Object} props Props
 * @returns {JSX}
 */
const ProductUnitQuantityPicker = ({
  children, className, product, disabled, stockInfo, size,
}) => {
  const { show = hasNewServices() } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker');

  const { quantity, setQuantity } = useContext(ProductContext);

  const { minValue, maxValue } = useMemo(() => {
    let min;
    let max;

    if (stockInfo?.minOrderQuantity > 0) {
      min = stockInfo.minOrderQuantity;
    }

    if (stockInfo?.maxOrderQuantity > 0) {
      max = stockInfo.maxOrderQuantity;
    }

    return {
      minValue: min,
      maxValue: max,
    };
  }, [stockInfo]);

  if (!product || !show) {
    return null;
  }

  const { unit, hasCatchWeight } = product;
  const hasUnitWithDecimals = (unit && hasCatchWeight) || false;

  return (
    <SurroundPortals portalName={PRODUCT_UNIT_QUANTITY_PICKER}>
      <div className={classNames(styles.root, className)}>
        <div>
          <div className={styles.title}>
            <I18n.Text string="product.sections.quantity" />
          </div>
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
            size={size}
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
  size: PropTypes.oneOf(['default', 'large']),
  stockInfo: PropTypes.shape(),
};

ProductUnitQuantityPicker.defaultProps = {
  disabled: false,
  product: null,
  size: undefined,
  stockInfo: null,
  children: null,
  className: null,
};

export default withCurrentProduct(connect(ProductUnitQuantityPicker));
