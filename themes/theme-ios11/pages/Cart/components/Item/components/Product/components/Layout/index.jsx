import React from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import Grid from '@shopgate/pwa-common/components/Grid';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import PriceInfo from '@shopgate/pwa-ui-shared/PriceInfo';
import ProductImage from 'Components/ProductImage';
import QuantityPicker from './components/QuantityPicker';
import Title from './components/Title';
import ProductPrice from './components/ProductPrice';
import Properties from './components/Properties';
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
        <Portal name={portals.CART_ITEM_IMAGE_BEFORE} props={context} />
        <Portal name={portals.CART_ITEM_IMAGE} props={context}>
          <ProductImage src={props.product.featuredImageUrl} />
        </Portal>
        <Portal name={portals.CART_ITEM_IMAGE_AFTER} props={context} />
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
        <Grid.Item grow={1} className={styles.propertyColumn}>
          <Properties properties={props.product.properties} />
        </Grid.Item>
        <Grid.Item grow={1} shrink={1} className={styles.priceColumn}>
          <ProductPrice
            currency={props.currency}
            defaultPrice={props.product.price.default}
            specialPrice={props.product.price.special}
          />
          {
            props.product.price.info && (
              <PriceInfo className={styles.priceInfo} text={props.product.price.info} />
            )
          }
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
  handleDelete: () => {},
  handleUpdate: () => {},
  toggleEditMode: () => {},
};

Layout.contextTypes = {
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default Layout;
