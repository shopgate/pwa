import React from 'react';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_HEADER,
  PRODUCT_HEADER_AFTER,
  PRODUCT_HEADER_BEFORE,
} from '@shopgate/engage/product/constants';
import { Section } from '@shopgate/engage/a11y';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { Rating } from '@shopgate/engage/product/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import CTAButtons from './components/CTAButtons';
import Name from './components/Name';
import ProductInfo from './components/ProductInfo';

const useStyles = makeStyles()(() => ({
  content: {
    position: 'relative',
    padding: themeVariables.gap.big,
  },
}));

/**
 * Product header component.
 * @returns {JSX.Element}
 */
const ProductHeader = () => {
  const { classes, cx } = useStyles();

  /**
   * @param {Object} params Params from product context.
   * @param {string} params.productId Product id.
   * @param {string} [params.variantId] Variant id.
   * @param {Object} [params.options] Options.
   * @returns {JSX.Element}
   */
  const consumeRenderer = ({ productId, variantId, options }) => {
    const id = variantId || productId;

    return (
      <div className={cx(classes.content, 'theme__product__header')}>
        <CTAButtons productId={id} />
        <Section title="product.sections.information">
          <Rating productId={productId} />
          <Name productId={id} />
          <ProductInfo productId={id} options={options} />
        </Section>
      </div>
    );
  };

  return (
    <>
      <Portal name={PRODUCT_HEADER_BEFORE} />
      <Portal name={PRODUCT_HEADER}>
        <ProductContext.Consumer>
          {consumeRenderer}
        </ProductContext.Consumer>
      </Portal>
      <Portal name={PRODUCT_HEADER_AFTER} />
    </>
  );
};

export default ProductHeader;
