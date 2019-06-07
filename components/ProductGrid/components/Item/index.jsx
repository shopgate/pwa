import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import Link from '@shopgate/pwa-common/components/Link';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants/index';
import ItemImage from './components/ItemImage';
import ItemDiscount from './components/ItemDiscount';
import ItemFavoritesButton from './components/ItemFavoritesButton';
import ItemDetails from './components/ItemDetails';
import styles from './style';

/**
 * The Product Grid Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ product, display }) => (
  <Link
    tagName="a"
    href={`${ITEM_PATH}/${bin2hex(product.id)}`}
    className={styles}
    state={{ title: product.name }}
    tabIndex={-1}
  >
    <ItemImage
      productId={product.id}
      name={product.name}
      imageUrl={product.featuredImageUrl}
    />
    <ItemDiscount
      productId={product.id}
      discount={product.price.discount || null}
    />
    <ItemFavoritesButton
      productId={product.id}
    />
    <ItemDetails
      productId={product.id}
      name={product.name}
      price={product.price}
      display={display}
    />
  </Link>
);

Item.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

Item.defaultProps = {
  display: null,
};

export default pure(Item);
