import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Link, ProductProperties, PriceInfo, SurroundPortals,
} from '@shopgate/engage/components';
import {
  CART_ITEM_IMAGE,
  CART_ITEM_LINK,
  CART_ITEM_PROPERTIES,
  CART_ITEM_QUANTITY_PICKER,
} from '@shopgate/engage/cart';
import { showTaxDisclaimer } from '@shopgate/engage/market';
import { bin2hex, useWidgetSettings } from '@shopgate/engage/core';
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
const Layout = (props, context) => {
  const {
    show,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');
  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = typeof show === 'boolean' ? show : showTaxDisclaimer;

  return (
    <Grid className={styles.item}>
      <Grid.Item className={styles.content} grow={1}>
        <SurroundPortals portalName={CART_ITEM_LINK} portalProps={{ context, ...props }}>
          <Link tagName="a" href={`${ITEM_PATH}/${bin2hex(props.product.id)}`}>
            <Title
              handleRemove={props.handleDelete}
              toggleEditMode={props.toggleEditMode}
              value={props.product.name}
            />
          </Link>
        </SurroundPortals>
        <Grid className={styles.info}>
          <Grid.Item grow={1} className={styles.properties}>
            <SurroundPortals portalName={CART_ITEM_PROPERTIES} portalProps={{ context, ...props }}>
              <ProductProperties properties={props.product.properties} lineClamp={2} />
            </SurroundPortals>
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
          {showDisclaimer && (
            <Grid.Item
              className={styles.disclaimerSpacer}
              grow={0}
              shrink={0}
            />
          )}
        </Grid>
      </Grid.Item>
      {/** DOM reversed for a11y navigation */}
      <Grid.Item className={styles.leftColumn}>
        <div className={styles.image} aria-hidden>
          <SurroundPortals portalName={CART_ITEM_IMAGE} portalProps={context}>
            <ProductImage src={props.product.featuredImageUrl} />
          </SurroundPortals>
        </div>
        <SurroundPortals
          portalName={CART_ITEM_QUANTITY_PICKER}
          portalProps={{ context, ...props }}
        >
          <QuantityPicker
            quantity={props.quantity}
            editMode={props.editMode}
            onChange={props.handleUpdate}
            onToggleEditMode={props.toggleEditMode}
          />
        </SurroundPortals>
      </Grid.Item>
    </Grid>
  );
};

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
