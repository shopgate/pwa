import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_ITEM_IMAGE } from '@shopgate/engage/category/constants';
import { getProductImageSettings, ProductImage } from '@shopgate/engage/product';

const { ListImage: gridResolutions } = getProductImageSettings();

/**
 * The item image component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ItemImage = ({
  productId,
  name,
  imageUrl,
}) => {
  const portalProps = useMemo(() => ({ productId }), [productId]);

  return (
    <SurroundPortals portalName={PRODUCT_ITEM_IMAGE} portalProps={portalProps}>
      <ProductImage
        alt={name}
        src={imageUrl}
        resolutions={gridResolutions}
        itemProp="image"
      />
    </SurroundPortals>
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
