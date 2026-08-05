import React from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ProductCard as EngageProductCard } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()((_theme, { shadow }) => ({
  root: {
    // Card chrome now lives on the engage ProductCard itself — background, radius and border from
    // theme.components.cards.*, the shadow from the admin configuration. This wrapper stays a
    // neutral positioning container so it never clips that shadow. A custom `render` that doesn't
    // use the engage ProductCard has to bring its own chrome.
    position: 'relative',
    // `shadow={false}` predates the card settings, when the shadow sat on this wrapper. The card
    // now draws its own shadow from the admin configuration, so the prop is honoured by
    // suppressing it on the card rendered inside this wrapper.
    ...!shadow && {
      '& .engage__product-card': {
        boxShadow: 'none',
      },
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
 * configured in the admin under "Cards & Tiles". Only `false` still has an effect.
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
  /** @deprecated Configure the card shadow in the admin under "Cards & Tiles". */
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
