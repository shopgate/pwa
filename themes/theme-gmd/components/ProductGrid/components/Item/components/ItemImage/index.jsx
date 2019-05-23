import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_IMAGE,
  PRODUCT_ITEM_IMAGE_AFTER,
  PRODUCT_ITEM_IMAGE_BEFORE,
} from '@shopgate/engage/category';
import { ProductImage } from '@shopgate/engage/product';

/**
 * The item image component.
 */
class ItemImage extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
  };

  static defaultProps = {
    imageUrl: null,
    name: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { productId, name, imageUrl } = this.props;
    const props = { productId };

    return (
      <Fragment>
        <Portal name={PRODUCT_ITEM_IMAGE_BEFORE} props={props} />
        <Portal name={PRODUCT_ITEM_IMAGE} props={props}>
          <ProductImage alt={name} itemProp="image" src={imageUrl} />
        </Portal>
        <Portal name={PRODUCT_ITEM_IMAGE_AFTER} props={props} />
      </Fragment>
    );
  }
}

export default ItemImage;
