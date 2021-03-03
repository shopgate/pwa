import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { PRODUCT_ORDER_QUANTITY } from '@shopgate/engage/product';
import { formatFloat } from '@shopgate/engage/components/QuantityInput/helper';
import withProductStock from '../../hocs/withProductStock';
import withProduct from '../../hocs/withProduct';
import { hint } from './style';

/**
 * The Product Order Quantity Hint component.
 * @return {JSX}
 */
const OrderQuantityHint = ({ stock, product, className }) => {
  const { hasCatchWeight, unit: productUnit } = product || {};

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
        {stock && !!stock.minOrderQuantity &&
          <div className={hint}>
            <I18n.Text
              string="product.minOrderQuantity"
              params={{
                quantity: formatFloat(stock.minOrderQuantity, maxDecimals),
                unit,
              }}
            />
          </div>
          }
        {stock && !!stock.maxOrderQuantity &&
          <div className={hint}>
            <I18n.Text
              string="product.maxOrderQuantity"
              params={{
                quantity: formatFloat(stock.maxOrderQuantity, maxDecimals),
                unit,
              }}
            />
          </div>
        }
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
