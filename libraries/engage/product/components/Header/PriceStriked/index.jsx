import React from 'react';
import PropTypes from 'prop-types';
import {
  Portal,
  I18n,
  PlaceholderLabel,
  PriceStriked as StrikePrice,
} from '@shopgate/engage/components';
import {
  PRODUCT_PRICE_STRIKED,
  PRODUCT_PRICE_STRIKED_AFTER,
  PRODUCT_PRICE_STRIKED_BEFORE,
} from '@shopgate/engage/product/constants';
import { withPriceCalculation } from '@shopgate/engage/product/hocs';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
  msrp: {
    color: colors.shade11,
    fontSize: '0.875rem',
    marginRight: variables.gap.small / 2,
  },
  msrpStriked: {
    display: 'inline',
    fontSize: '0.875rem',
  },
});

/**
 * The PriceStriked component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PriceStriked = ({ price }) => {
  const { classes } = useStyles();
  const {
    msrpLabel = 'price.msrp',
    unitPriceStrikedLabel,
  } = useWidgetSettings('@shopgate/engage/product/components/Header/PriceStriked');

  return (
    <>
      <Portal name={PRODUCT_PRICE_STRIKED_BEFORE} />
      <Portal name={PRODUCT_PRICE_STRIKED}>
        <PlaceholderLabel className={classes.placeholder} ready={(price !== null)}>
          {(price && price.msrp > 0 && price.unitPrice !== price.msrp) && (
            <>
              {!!msrpLabel && (<I18n.Text string={msrpLabel} className={classes.msrp} />)}
              <StrikePrice
                className={classes.msrpStriked}
                value={price.msrp}
                currency={price.currency}
              />
            </>
          )}
          {(price &&
            !price.msrp &&
            price.unitPriceStriked > 0 &&
            price.unitPrice !== price.unitPriceStriked
          ) && (
            <>
              {!!unitPriceStrikedLabel && (
                <I18n.Text string={unitPriceStrikedLabel} className={classes.msrp} />
              )}
              <StrikePrice value={price.unitPriceStriked} currency={price.currency} />
            </>
          )}
        </PlaceholderLabel>
      </Portal>
      <Portal name={PRODUCT_PRICE_STRIKED_AFTER} />
    </>
  );
};

PriceStriked.propTypes = {
  price: PropTypes.shape(),
};

PriceStriked.defaultProps = {
  price: null,
};

export default connect(withPriceCalculation(PriceStriked));
