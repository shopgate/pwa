import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_UNIT_QUANTITY_PICKER, ProductContext } from '@shopgate/engage/product';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { withCurrentProduct } from '@shopgate/engage/core/hocs';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import UnitQuantityPicker from './UnitQuantityPicker';
import connect from './ProductUnitQuantityPicker.connector';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  pickerSmall: {
    width: 120,
  },
  pickerBig: {
    width: 170,
  },
}));

/**
 * Renders the quantity picker enriched with current product data.
 * @param {Object} props Props
 * @returns {JSX}
 */
const ProductUnitQuantityPicker = ({
  children,
  className,
  classes: customClasses,
  product,
  disabled,
  stockInfo,
  size,
  quantityLabel,
  hideHeadline,
}) => {
  const { classes, cx } = useStyles();
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
      <div className={cx(classes.root, className)}>
        <div>
          {!hideHeadline && (
            <div className={classes.title}>
              <I18n.Text string="product.sections.quantity" />
            </div>
          )}
          <UnitQuantityPicker
            className={customClasses?.picker
              || (hasUnitWithDecimals ? classes.pickerBig : classes.pickerSmall)}
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
            quantityLabel={quantityLabel}
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
  classes: PropTypes.shape({
    picker: PropTypes.string,
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hideHeadline: PropTypes.bool,
  product: PropTypes.shape(),
  quantityLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
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
  quantityLabel: null,
  classes: {
    picker: null,
  },
  hideHeadline: false,
};

export default withCurrentProduct(connect(ProductUnitQuantityPicker));
