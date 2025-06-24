import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import connect from './connector';
import { itemClass, shadowStyle } from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
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
    ...shadow && shadowStyle,
  };
  const url = `${ITEM_PATH}/${bin2hex(product.id)}`;

  return (
    <section
      className={`${itemClass} theme__product-card ui-shared__card`}
      style={cardStyle}
      data-test-id={`Product: ${product.name}`}
    >
      {render({
        product,
        url,
      })}
    </section>
  );
}

ProductCard.Content = EngageProductCard;

ProductCard.propTypes = {
  product: PropTypes.shape(),
  render: PropTypes.func,
  shadow: PropTypes.bool,
  style: PropTypes.shape(),
};

ProductCard.defaultProps = {
  product: null,
  render: props => <EngageProductCard {...props} />,
  shadow: true,
  style: {},
};

export default connect(ProductCard);

export { ProductCard as ProductCardUnwrapped };
