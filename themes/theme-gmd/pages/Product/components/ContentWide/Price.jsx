import React, { memo } from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { PriceStriked, Tiers } from '@shopgate/engage/product/components/Header';
import { ProductContext } from '@shopgate/engage/product/contexts';
import Price from '../Header/components/Price';
import PriceInfo from '../Header/components/PriceInfo';

const useStyles = makeStyles()({
  headline: {
    marginTop: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
});

/**
 * PriceWrapper
 * @returns {JSX}
 */
const PriceWrapper = () => {
  const { classes } = useStyles();

  return (
    <ProductContext.Consumer>
      {({ productId, variantId, options }) => {
        const id = variantId || productId;
        return (
          <div>
            <div className={classes.headline}>
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
};

export default memo(PriceWrapper);
