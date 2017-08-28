import React, { PropTypes } from 'react';
import { Grid } from 'Library/components';
import {
  ProductImage,
  QuantityPicker,
} from 'Templates/components';
import ProductTitle from './Title';
import ProductPrice from './Price';
import ProductProperties from './Properties';
import styles from '../style';

/**
 * The ProductLayout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ProductLayout = props => (
  <Grid className={styles.item}>
    <Grid.Item className={styles.leftColumn}>
      <div className={styles.image}>
        <ProductImage src={props.product.featuredImageUrl} />
      </div>
      <QuantityPicker
        quantity={props.quantity}
        editMode={props.editMode}
        onChange={props.handleUpdate}
        onToggleEditMode={props.toggleEditMode}
      />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <ProductTitle
        handleRemove={props.handleDelete}
        toggleEditMode={props.toggleEditMode}
        value={props.product.name}
      />
      <Grid className={styles.info}>
        <ProductProperties
          properties={props.product.properties}
        />
        <ProductPrice
          currency={props.currency}
          defaultPrice={props.product.price.default}
          specialPrice={props.product.price.special}
        />
      </Grid>
    </Grid.Item>
  </Grid>
);

ProductLayout.propTypes = {
  currency: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  product: PropTypes.shape().isRequired,
  quantity: PropTypes.number.isRequired,
  handleDelete: PropTypes.func,
  handleUpdate: PropTypes.func,
  toggleEditMode: PropTypes.func,
};

ProductLayout.defaultProps = {
  handleDelete: () => {},
  handleUpdate: () => {},
  toggleEditMode: () => {},
};

export default ProductLayout;
