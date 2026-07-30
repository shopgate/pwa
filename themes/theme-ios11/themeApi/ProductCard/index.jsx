import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()((theme, { shadow }) => ({
  root: {
    // Card chrome (background, radius, shadow, border) now lives on the engage
    // ProductCard itself, driven by theme.components.cards.*. This wrapper stays a
    // neutral positioning container so it never clips the card's shadow. A custom
    // `render` that doesn't use the engage ProductCard has to bring its own chrome.
    position: 'relative',
    // `shadow={false}` predates the card tokens, when the shadow sat on this wrapper. It is
    // honoured by overriding the token itself: custom properties inherit, so this reaches the
    // card that draws the shadow, plus anything else in the subtree reading the same token.
    ...!shadow && {
      [theme.vars.components.cards.boxShadow]: 'none',
    },
  },
}));

/**
 * ProductCard component for theme-ios11.
 * @param {Object} props The component props.
 * @param {Object} props.product The product object.
 * @param {Function} props.render The render function for the card content.
 * @param {string} props.className Custom class name for the card.
 * @param {boolean} props.shadow Whether to show a shadow. Deprecated — the card shadow is
 * configured via the `--sg-cards-boxShadow` custom property. Only `false` still has an effect.
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
  const { classes, cx } = useStyles({ shadow });

  if (!product) {
    return null;
  }

  const url = `${ITEM_PATH}/${bin2hex(product.id)}`;

  return (
    <section
      className={cx(classes.root, className, 'theme__product-card')}
      style={style}
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
  className: PropTypes.string,
  product: PropTypes.shape(),
  render: PropTypes.func,
  /** @deprecated Configure the card shadow via the `--sg-cards-boxShadow` custom property. */
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
