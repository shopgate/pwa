import React from 'react';
import {
  PRODUCT_HEADER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { Section } from '@shopgate/engage/a11y';
import { ResponsiveContainer, SurroundPortals } from '@shopgate/engage/components';
import { Rating } from '@shopgate/engage/product/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import CTAButtons from './components/CTAButtons';
import Name from './components/Name';
import ProductInfo from './components/ProductInfo';

const useStyles = makeStyles()(theme => ({
  content: {
    position: 'relative',
    padding: theme.spacing(2),
    borderTop: `${themeColors.placeholder} 2px solid`,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      borderTop: 'none',
    },
  },
}));

/**
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
        <ResponsiveContainer breakpoint="xs" appAlways>
          <CTAButtons productId={id} />
        </ResponsiveContainer>
        <Section title="product.sections.information">
          <Rating productId={productId} />
          <Name productId={id} />
          <ProductInfo productId={id} options={options} />
        </Section>
      </div>
    );
  };

  return (
    <SurroundPortals portalName={PRODUCT_HEADER}>
      <ProductContext.Consumer>
        {consumeRenderer}
      </ProductContext.Consumer>
    </SurroundPortals>
  );
};

export default ProductHeader;
