import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { getProductRoute, FeaturedMedia, ProductBadges } from '@shopgate/engage/product';
import { Link } from '@shopgate/engage/components';
import { useProductListType } from '@shopgate/engage/product/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { useSelector } from 'react-redux';
import { getProductTileActions } from '@shopgate/engage/settings/selectors/appSettings';
import { ProductCardAddToCart } from '../../../ProductCardAddToCart';
import { ProductTileActions } from '../../../ProductTileActions';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemDetails from './components/ItemDetails';

const useStyles = makeStyles()((theme, { display }) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.components.tiles.padding,
    background: theme.components.tiles.backgroundColor,
    border: theme.components.tiles.border,
    borderRadius: theme.components.tiles.borderRadius,
  },
  image: {
    display: 'block',
    padding: theme.components.tiles.imagePadding,
  },
  imageWrapper: {
    position: 'relative',
  },
  addToCartButton: {
    marginTop: 'auto',
    padding: theme.components.tiles.textPadding,
    paddingTop: `max(0px, calc(8px - ${theme.components.tiles.textPadding}))`,
  },
  itemDetails: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    ...display && !display.name && !display.price && !display.reviews && {
      paddingBottom: 30,
    },
  },
}));

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @param {Object} props.product The product.
 * @param {Object} props.display The display object.
 * @return {JSX.Element}
 */
const Item = ({ product, display }) => {
  const { classes, cx } = useStyles({ display });
  const { meta } = useProductListType();
  const { addToCart } = useSelector(getProductTileActions);

  return (
    <div className={cx(classes.root, 'theme__product-grid__item')}>
      <div className={classes.imageWrapper}>
        <Link
          className={classes.image}
          role="none"
          href={getProductRoute(product.id)}
          state={{
            title: product.name,
            ...meta,
          }}
        >
          {isBeta() && product.featuredMedia
            ? <FeaturedMedia
                type={product.featuredMedia.type}
                url={product.featuredMedia.url}
            />
            : <ItemImage
                productId={product.id}
                name={product.name}
                imageUrl={product.featuredImageBaseUrl}
            />}
        </Link>
        <ProductTileActions productId={product.id} />
      </div>
      <ProductBadges location="productGrid" productId={product.id}>
        <ItemDiscount
          productId={product.id}
          discount={product.price.discount || null}
        />
      </ProductBadges>
      <div className={classes.itemDetails}>
        <ItemDetails
          product={product}
          display={display}
          productListTypeMeta={meta}
        />
        {addToCart === 'button' && (
          <ProductCardAddToCart
            productId={product.id}
            variant="button"
            className={classes.addToCartButton}
          />
        )}
      </div>
    </div>
  );
};

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default memo(Item);
