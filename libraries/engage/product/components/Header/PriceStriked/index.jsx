import React from 'react';
import PropTypes from 'prop-types';
import {
  Portal,
  I18n,
  PlaceholderLabel,
  Typography,
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
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
  msrp: {
    color: theme.palette.grey.dark,
    marginRight: theme.spacing(0.5),
  },
  msrpStriked: {
    display: 'inline',
  },
}));

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
              {!!msrpLabel && (
                <Typography variant="body2" component="span" className={classes.msrp}>
                  <I18n.Text string={msrpLabel} />
                </Typography>
              )}
              <Typography variant="body2" component="span" className={classes.msrpStriked}>
                <StrikePrice
                  value={price.msrp}
                  currency={price.currency}
                />
              </Typography>
            </>
          )}
          {(price &&
            !price.msrp &&
            price.unitPriceStriked > 0 &&
            price.unitPrice !== price.unitPriceStriked
          ) && (
            <>
              {!!unitPriceStrikedLabel && (
                <Typography variant="body2" component="span" className={classes.msrp}>
                  <I18n.Text string={unitPriceStrikedLabel} />
                </Typography>
              )}
              <Typography variant="body2" component="span" className={classes.msrpStriked}>
                <StrikePrice value={price.unitPriceStriked} currency={price.currency} />
              </Typography>
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
