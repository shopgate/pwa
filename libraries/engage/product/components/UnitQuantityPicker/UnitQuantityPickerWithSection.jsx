import React, { useMemo } from 'react';
import { css } from 'glamor';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { withCurrentProduct, withWidgetSettings } from '@shopgate/engage/core/hocs';
import { Section } from '@shopgate/engage/a11y/components';
import { makeGetCurrentProductPropertyByLabel } from '@shopgate/engage/product/selectors/product';
import ProductUnitQuantityPicker from './ProductUnitQuantityPicker';
import OrderQuantityHint from '../OrderQuantityHint';

const styles = {
  quantityPicker: css({
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
  quantityPickerPicker: css({
    width: '100%',
  }).toString(),
  quantityHint: css({
    '&:not(:empty)': {
      paddingTop: 8,
      marginBottom: -4,
    },
  }).toString(),
};

/**
 * A Quantity Picker with unit support.
 * @returns {JSX.Element}
 */
const UnitQuantityPickerWithSection = ({
  productId,
  variantId,
  productProperty,
}) => {
  const { show = hasNewServices() } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker');

  const quantityLabel = useMemo(() => {
    if (!show) {
      return null;
    }

    let label = i18n.text('product.sections.quantity');
    if ((productProperty?.value ?? '') !== '') {
      label = productProperty.value;
    }

    return label;
  }, [productProperty, show]);

  if (!show) {
    return null;
  }

  return (
    <Section title="product.sections.quantity">
      <ProductUnitQuantityPicker
        className={styles.quantityPicker}
        classes={{ picker: styles.quantityPickerPicker }}
        size="large"
        quantityLabel={quantityLabel}
        hideHeadline
      >
        <OrderQuantityHint
          productId={variantId || productId}
          className={styles.quantityHint}
        />
      </ProductUnitQuantityPicker>
    </Section>
  );
};

UnitQuantityPickerWithSection.propTypes = {
  productId: PropTypes.string,
  productProperty: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  variantId: PropTypes.string,
};

UnitQuantityPickerWithSection.defaultProps = {
  productId: null,
  variantId: null,
  productProperty: null,
};

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getCurrentProductPropertyByLabel = makeGetCurrentProductPropertyByLabel();
  return (state, props) => ({
    productProperty: getCurrentProductPropertyByLabel(state, props),
  });
};

export default withWidgetSettings(
  withCurrentProduct(connect(makeMapStateToProps)(UnitQuantityPickerWithSection)),
  '@shopgate/engage/product/components/UnitQuantityPicker'
);

