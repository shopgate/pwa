import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';

const { currency } = appConfig;

const useStyles = makeStyles()(theme => ({
  priceRange: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: theme.spacing(0.5),
    rowGap: theme.spacing(1),
  },
  editableField: {
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: 'center',
    background: theme.palette.background.surface,
    outline: 'none',
    padding: theme.spacing(0.5, 0),
    margin: theme.spacing(0, 0.5),
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: 3,
    appearance: 'textfield',
    WebkitAppearance: 'textfield',
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    ':focus': {
      borderColor: theme.components.border.medium,
    },
    [responsiveMediaQuery('>=xs', { webOnly: true })]: {
      borderColor: theme.palette.primary.main,
      ':focus': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
  priceField: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  currencySymbol: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(0.25),
  },
}));

/**
 * Builds the width a price field needs to fit its current value.
 * @param {number|string} value The value the field has to fit.
 * @returns {string}
 */
const fieldWidth = value => `${Math.max(String(value).length, 2) + 1}ch`;

/**
 * The filter price range slider label component.
 * @param {Object} props The component props.
* @returns {JSX.Element}
 */
function Label(props) {
  const { classes } = useStyles();
  const {
    priceMax, priceMin, onChange,
  } = props;
  const [minValue, setMinValue] = useState(priceMin);
  const [maxValue, setMaxValue] = useState(priceMax);

  // Set new values, when prices change from outside.
  useEffect(() => {
    setMinValue(priceMin);
    setMaxValue(priceMax);
  }, [priceMin, priceMax]);

  /**
   * Selects the field content on click.
   * @param {SyntheticEvent} event The click event object.
   */
  function handleFieldClick({ target }) {
    target.select();
  }

  /**
   * Handles the change of the minimum price field.
   * @param {SyntheticEvent} event The change event object.
   */
  function handleChangeMin({ target }) {
    setMinValue(target.value);
    if (target.value) {
      onChange([parseInt(target.value, 10) * 100, parseInt(maxValue, 10) * 100]);
    }
  }

  /**
   * Handles the change of the maximum price field.
   * @param {SyntheticEvent} event The change event object.
   */
  function handleChangeMax({ target }) {
    setMaxValue(target.value);
    if (target.value) {
      onChange([parseInt(minValue, 10) * 100, parseInt(target.value, 10) * 100]);
    }
  }

  const currencySymbol = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format('0').replace('0.00', '');

  return (
    <div>
      <span className={classes.srOnly}>
        {i18n.text('price.range', {
          fromPrice: i18n.price(priceMin, currency, false),
          toPrice: i18n.price(priceMax, currency, false),
        })}
      </span>
      <I18n.Text string="price.range" aria-hidden className={classes.priceRange}>
        <I18n.Placeholder forKey="fromPrice">
          <span className={classes.priceField}>
            <span aria-hidden className={classes.currencySymbol} id="price-slider-currency-label-min">
              {currencySymbol}
            </span>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="priceMin"
              name="priceMin"
              value={minValue}
              onChange={handleChangeMin}
              onClick={handleFieldClick}
              style={{ width: fieldWidth(minValue) }}
              className={classes.editableField}
              aria-label={i18n.text('price.range_from')}
              aria-describedby="price-slider-currency-label-min"
            />
          </span>
        </I18n.Placeholder>
        <I18n.Placeholder forKey="toPrice">
          <span className={classes.priceField}>
            <span aria-hidden className={classes.currencySymbol} id="price-slider-currency-label-max">
              {currencySymbol}
            </span>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="priceMax"
              name="priceMax"
              value={maxValue}
              onChange={handleChangeMax}
              onClick={handleFieldClick}
              style={{ width: fieldWidth(maxValue) }}
              className={classes.editableField}
              aria-label={i18n.text('price.range_to')}
              aria-describedby="price-slider-currency-label-max"
            />
          </span>
        </I18n.Placeholder>
      </I18n.Text>
    </div>
  );
}

Label.propTypes = {
  onChange: PropTypes.func.isRequired,
  priceMax: PropTypes.number.isRequired,
  priceMin: PropTypes.number.isRequired,
};

export default memo(Label);
