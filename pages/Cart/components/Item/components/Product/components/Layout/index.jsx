import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Portal, Link, ProductProperties, PriceInfo,
} from '@shopgate/engage/components';
import {
  CART_ITEM_IMAGE_BEFORE, CART_ITEM_IMAGE, CART_ITEM_IMAGE_AFTER,
} from '@shopgate/engage/cart';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { bin2hex } from '@shopgate/engage/core';
import { ProductImage, ITEM_PATH } from '@shopgate/engage/product';
import QuantityPicker from './components/QuantityPicker';
import Title from './components/Title';
import ProductPrice from './components/ProductPrice';
import styles from './style';

/**
 * The Cart Product Layout component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Layout = (props, context) => (
  <Grid className={styles.item}>
    <Grid.Item className={styles.leftColumn}>
      <div className={styles.image}>
        <Link
          tagName="a"
          href={`${ITEM_PATH}/${bin2hex(props.product.id)}`}
          aria-label={props.product.name}
          itemProp="item"
          itemScope
          itemType="http://schema.org/Product"
        >
          <Portal name={CART_ITEM_IMAGE_BEFORE} props={context} />
          <Portal name={CART_ITEM_IMAGE} props={context}>
            <ProductImage src={props.product.featuredImageUrl} />
          </Portal>
          <Portal name={CART_ITEM_IMAGE_AFTER} props={context} />
        </Link>
      </div>
      <QuantityPicker
        quantity={props.quantity}
        editMode={props.editMode}
        onChange={props.handleUpdate}
        onToggleEditMode={props.toggleEditMode}
      />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <Title
        handleRemove={props.handleDelete}
        toggleEditMode={props.toggleEditMode}
        value={props.product.name}
      />
      <Grid className={styles.info}>
        <Grid.Item grow={1} className={styles.properties}>
          <ProductProperties properties={props.product.properties} lineClamp={2} />
        </Grid.Item>
        <Grid.Item grow={1} className={styles.price}>
          <ProductPrice
            currency={props.currency}
            defaultPrice={props.product.price.default}
            specialPrice={props.product.price.special}
          />
          {props.product.price.info && (
            <PriceInfo className={styles.priceInfo} text={props.product.price.info} />
          )}
        </Grid.Item>
        {showTaxDisclaimer && (
          <Grid.Item
            className={styles.disclaimerSpacer}
            grow={0}
            shrink={0}
          />
        )}
      </Grid>
    </Grid.Item>
  </Grid>
);

Layout.propTypes = {
  currency: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  quantity: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  toggleEditMode: PropTypes.func,
};

Layout.defaultProps = {
  handleDelete: () => { },
  handleUpdate: () => { },
  toggleEditMode: () => { },
};

Layout.contextTypes = {
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default Layout;
