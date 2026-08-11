import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import Card from '@shopgate/engage/components/Card';
import { cx } from '@shopgate/engage/styles';
import connect from './connector';

/**
 * ProductCard component for theme-ios11.
 * @param {Object} props The component props.
 * @param {Object} props.product The product object.
 * @param {Function} props.render The render function for the card content.
 * @param {string} props.className Custom class name for the card.
 * @param {boolean} props.shadow Whether to show a shadow.
 * @param {Object} props.style Custom style for the card.
 * @returns {JSX.Element}
 */
function ProductCard({
  product,
  render,
  className,
  shadow,
  style,
  ...props
}) {
  if (!product) {
    return null;
  }

  const url = `${ITEM_PATH}/${bin2hex(product.id)}`;

  return (
    <Card
      component="section"
      className={cx('theme__product-card', className)}
      style={style}
      {...!shadow && { elevation: 0 }}
      data-test-id={`Product: ${product.name}`}
    >
      {render({
        product,
        url,
        ...props,
      })}
    </Card>
  );
}

ProductCard.Content = EngageProductCard;

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.shape(),
  render: PropTypes.func,
  shadow: PropTypes.bool,
  style: PropTypes.shape(),
};

ProductCard.defaultProps = {
  className: null,
  product: null,
  render: props => <EngageProductCard {...props} />,
  shadow: true,
  style: {},
};

export default connect(ProductCard);

export { ProductCard as ProductCardUnwrapped };
