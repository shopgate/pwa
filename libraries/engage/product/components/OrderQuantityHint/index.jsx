import React from 'react';
import PropTypes from 'prop-types';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { isBeta } from '@shopgate/engage/core';
import { PRODUCT_ORDER_QUANTITY } from '@shopgate/engage/product';
import withProductStock from '../../hocs/withProductStock';
import { hint } from './style';

/**
 * The Product Order Quantity Hint component.
 * @return {JSX}
 */
const OrderQuantityHint = ({ stock }) => {
  if (!isBeta()) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_ORDER_QUANTITY} portalProps={{ stock }}>
      {stock && !!stock.minOrderQuantity &&
        <div className={hint}>
          <I18n.Text
            string="product.minOrderQuantity"
            params={{ quantity: stock.minOrderQuantity }}
          />
        </div>
        }
      {stock && !!stock.maxOrderQuantity &&
        <div className={hint}>
          <I18n.Text
            string="product.maxOrderQuantity"
            params={{ quantity: stock.maxOrderQuantity }}
          />
        </div>
      }
    </SurroundPortals>
  );
};

OrderQuantityHint.propTypes = {
  stock: PropTypes.shape(),
};

OrderQuantityHint.defaultProps = {
  stock: null,
};

export default withProductStock(OrderQuantityHint);
