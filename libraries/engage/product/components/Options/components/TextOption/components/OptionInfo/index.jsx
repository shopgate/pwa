import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid, I18n } from '@shopgate/engage/components';
import { ProductContext } from '@shopgate/engage/product/contexts';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  info: {
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0, 2),
  },
  required: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '0.825rem',
  },
  price: {
    textAlign: 'right',
    fontSize: '0.825rem',
  },
}));

/**
 * The text option info component
 * @param {Object} props The component props
 * @param {Object} context The component context
 * @return {JSX}
 */
const OptionInfo = ({
  required, label, price, currency, info, optionInfoId,
}, context) => {
  const { classes } = useStyles();

  if (!required && !price) {
    return null;
  }

  const { __, _p } = context.i18n();

  let ariaPrice = '';
  let ariaRequired = '';

  if (price) {
    ariaPrice = __('price.label', { price: _p(price, currency, 2).replace('-', '\u2212') });
  }

  if (required) {
    ariaRequired = __('common.required');
  }

  return (
    <Grid className={classes.info}>
      {required &&
        <Grid.Item className={classes.required} aria-hidden>
          <I18n.Text string="common.required" />
        </Grid.Item>}
      {!!price &&
        <Grid.Item grow={1} className={classes.price} aria-hidden>
          {`${label}: `}
          <I18n.Price
            currency={currency}
            price={price}
          />
        </Grid.Item>}
      <div hidden id={optionInfoId}>
        { ariaRequired }
        { ariaPrice }
        { info }
      </div>
    </Grid>
  );
};

OptionInfo.propTypes = {
  currency: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  optionInfoId: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
};

OptionInfo.contextTypes = {
  i18n: PropTypes.func,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const OptionInfoWithProductContext = props => (
  <ProductContext.Consumer>
    {({ currency }) => (
      <OptionInfo currency={currency} {...props} />
    )}
  </ProductContext.Consumer>
);

export default memo(OptionInfoWithProductContext);

export { OptionInfo };
