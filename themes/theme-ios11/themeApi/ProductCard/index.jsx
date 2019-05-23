import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/engage/core';
import { ITEM_PATH } from '@shopgate/engage/product';
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

ProductCard.Content = Render;

ProductCard.propTypes = {
  product: PropTypes.shape(),
  render: PropTypes.func,
  shadow: PropTypes.bool,
  style: PropTypes.shape(),
};

ProductCard.defaultProps = {
  product: null,
  render: props => <Render {...props} />,
  shadow: true,
  style: {},
};

export default connect(ProductCard);

export { ProductCard as ProductCardUnwrapped };
