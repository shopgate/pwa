import React, { memo } from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { PriceStriked, Tiers } from '@shopgate/engage/product/components/Header';
import Price from '../Header/components/Price';
import PriceInfo from '../Header/components/PriceInfo';
import { ProductContext } from '../../context';

const styles = {
  headline: css({
    marginTop: 16,
    marginBottom: 10,
    fontWeight: '500',
  }).toString(),
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const PriceWrapper = () => (
  <ProductContext.Consumer>
    {({ productId, variantId, options }) => {
      const id = variantId || productId;
      return (
        <div>
          <div className={styles.headline}>
            {i18n.text('product.sections.price')}
          </div>
          <div>
            <PriceStriked productId={id} options={options} />
          </div>
          <div>
            <Price
              showTaxDisclaimer={false}
              productId={id}
              options={options}
            />
          </div>
          <div>
            <PriceInfo productId={id} options={options} />
          </div>
          <div>
            <Tiers productId={id} options={options} />
          </div>
        </div>
      );
    }}
  </ProductContext.Consumer>
);

export default memo(PriceWrapper);
