import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_IMAGE,
  PRODUCT_ITEM_IMAGE_AFTER,
  PRODUCT_ITEM_IMAGE_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductImageSettings, ProductImage } from '@shopgate/engage/product';

const { ListImage: gridResolutions } = getProductImageSettings();

const useStyles = makeStyles()(theme => ({
  image: {
    background: theme.palette.background.surface,
  },
}));

/**
 * The item image component.
 * @param {Object} props The component props.
 * @param {string} props.productId The product id.
 * @param {string} [props.imageUrl] The product image url.
 * @param {string} [props.name] The product name.
 * @returns {JSX.Element}
 */
const ItemImage = ({ productId, name, imageUrl }) => {
  const { classes } = useStyles();
  const props = { productId };

  return (
    <>
      <Portal name={PRODUCT_ITEM_IMAGE_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_IMAGE} props={props}>
        <ProductImage
          className={classes.image}
          alt={name}
          src={imageUrl}
          resolutions={gridResolutions}
          itemProp="image"
        />
      </Portal>
      <Portal name={PRODUCT_ITEM_IMAGE_AFTER} props={props} />
    </>
  );
};

ItemImage.propTypes = {
  productId: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
};

ItemImage.defaultProps = {
  imageUrl: null,
  name: null,
};

export default memo(ItemImage);
