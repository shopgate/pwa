import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { getProductRoute, FeaturedMedia, ProductBadges } from '@shopgate/engage/product';
import { Link } from '@shopgate/engage/components';
import { useProductListType } from '@shopgate/engage/product/hooks';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    background: colors.light,
    fontSize: 14,
    height: '100%',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      flexDirection: 'row-reverse',
      border: `1px solid ${colors.shade7}`,
    },
  },
  itemDetails: {
    position: 'relative',
    flexGrow: 2,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      width: '66%',
    },
  },
  itemImage: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      width: '33%',
    },
  },
  badgesPortal: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      left: 'initial',
      right: 5,
      width: 'inherit',
    },
  },
});

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Item = ({ product, display }) => {
  const { classes, cx } = useStyles();
  const { meta } = useProductListType();

  return (
    <div className={cx(classes.root, 'theme__product-grid__item')}>
      <Link
        tag="a"
        role="none"
        href={getProductRoute(product.id)}
        state={{
          title: product.name,
          ...meta,
        }}
        className={classes.itemImage}
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
      <ProductBadges location="productGrid" productId={product.id} className={classes.badgesPortal}>
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
        <ItemFavoritesButton productId={product.id} />
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
