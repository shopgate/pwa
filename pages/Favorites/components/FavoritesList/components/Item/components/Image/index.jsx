import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import Link from '@shopgate/pwa-common/components/Link';
import { ProductImage } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import styles from './style';
import { getThemeSettings } from '@shopgate/engage/core/config/getThemeSettings';

/**
 *
 * @param {Object} product Product data
 * @constructor
 */
const Image = ({ product }) => {
  const { ListImage: gridResolutions } = getThemeSettings('AppImages') || {};

  return (
    <div className={styles.image} aria-hidden>
      <Link
        tagName="a"
        href={`${ITEM_PATH}/${bin2hex(product.id)}`}
        itemProp="item"
        itemScope
        itemType="http://schema.org/Product"
        state={{
          title: product.name,
        }}
      >
        <ProductImage src={product.featuredImageBaseUrl} resolutions={gridResolutions} />
      </Link>
    </div>
  );
}

Image.propTypes = {
  product: PropTypes.shape().isRequired,
};

export default Image;
