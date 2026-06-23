import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { i18n, hasNewServices, isBeta } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { PRODUCT_ORDER_QUANTITY } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import { formatFloat } from '@shopgate/engage/components/QuantityInput/helper';
import withProductStock from '../../hocs/withProductStock';
import withProduct from '../../hocs/withProduct';

const useStyles = makeStyles()({
  hint: {
    fontSize: '0.75rem',
    color: 'var(--color-text-medium-emphasis)',
  },
});

/**
 * The Product Order Quantity Hint component.
 * @return {JSX}
 */
const OrderQuantityHint = ({ stock, product, className }) => {
  const { classes } = useStyles();
  const { hasCatchWeight, unit: productUnit } = product || {};

  const settings = useWidgetSettings('@shopgate/engage/product/OrderQuantityHint');

  const showContent = useMemo(() => {
    if (hasNewServices()) {
      // During development of PWA 7 the component was shown by default
      return true;
    }

    return isBeta() && settings.show === true;
  }, [settings.show]);

  const unit = useMemo(() => {
    if (hasCatchWeight) {
      const key = `formats.unitOfMeasurement.${productUnit}`;
      const text = i18n.text(key);

      return text !== key ? text : (productUnit || '');
    }

    return '';
  }, [hasCatchWeight, productUnit]);

  const maxDecimals = useMemo(() =>
    (hasCatchWeight && productUnit ? 2 : 0),
  [hasCatchWeight, productUnit]);

  return (
    <div className={className}>
      <SurroundPortals portalName={PRODUCT_ORDER_QUANTITY} portalProps={{ stock }}>
        {showContent && stock && !!stock.minOrderQuantity &&
          <div className={classes.hint}>
            <I18n.Text
              string="product.minOrderQuantity"
              params={{
                quantity: formatFloat(stock.minOrderQuantity, maxDecimals),
                unit,
              }}
            />
          </div>}
        {showContent && stock && !!stock.maxOrderQuantity &&
          <div className={classes.hint}>
            <I18n.Text
              string="product.maxOrderQuantity"
              params={{
                quantity: formatFloat(stock.maxOrderQuantity, maxDecimals),
                unit,
              }}
            />
          </div>}
      </SurroundPortals>
    </div>
  );
};

OrderQuantityHint.propTypes = {
  className: PropTypes.string,
  product: PropTypes.shape(),
  stock: PropTypes.shape(),
};

OrderQuantityHint.defaultProps = {
  className: null,
  stock: null,
  product: null,
};

export default withProduct(withProductStock(OrderQuantityHint));
