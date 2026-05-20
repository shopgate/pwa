import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const shadowStyle = {
  boxShadow: themeShadows.productCard,
};

const useStyles = makeStyles()({
  root: {
    background: themeColors.light,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
});

/**
 * ProductCard component for theme-ios11.
 * @param {Object} props The component props.
 * @param {Object} props.product The product object.
 * @param {Function} props.render The render function for the card content.
 * @param {boolean} props.shadow Whether to show a shadow.
 * @param {Object} props.style Custom style for the card.
 * @returns {JSX.Element}
 */
function ProductCard({
  product,
  render,
  shadow,
  style,
  ...props
}) {
  const { classes, cx } = useStyles();

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
      className={cx(classes.root, 'theme__product-card')}
      style={cardStyle}
      data-test-id={`Product: ${product.name}`}
    >
      {render({
        product,
        url,
        ...props,
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
