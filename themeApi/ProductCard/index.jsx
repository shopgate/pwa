import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import Badge from './components/Badge';
import Title from './components/Title';
import Price from './components/Price';
import Render from './components/Render';
import connect from './connector';
import styles from './style';

const cardShadow = {
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.16)',
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ProductCard({
  product,
  render,
  shadow,
  style,
}) {
  if (!product) {
    return null;
  }

  const cardStyle = {
    ...style,
    ...shadow && cardShadow,
  };
  const url = `${ITEM_PATH}/${bin2hex(product.id)}`;

  return (
    <section className={styles} style={cardStyle} data-test-id={`Product: ${product.name}`}>
      {render({
        product,
        url,
      })}
    </section>
  );
}

ProductCard.Badge = Badge;
ProductCard.Price = Price;
ProductCard.Title = Title;

ProductCard.propTypes = {
  product: PropTypes.shape(),
  render: PropTypes.func,
  shadow: PropTypes.bool,
  style: PropTypes.shape(),
};

ProductCard.defaultProps = {
  product: null,
  render: Render,
  shadow: true,
  style: {},
};

export default connect(ProductCard);
