import React, {
  memo, useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '../../../../../styles';

const { currency } = appConfig;
const { colors } = themeConfig;

const useStyles = makeStyles()({
  price: {
    color: 'var(--color-secondary)',
    display: 'inline-block',
    fontWeight: 500,
    textAlign: 'center',
  },
  editableContainer: {
    position: 'relative',
  },
  editableField: {
    position: 'absolute',
    top: 0,
    left: 0,
    textAlign: 'center',
    background: 'transparent',
    zIndex: 2,
    textIndent: -800,
    outline: 'none',
    padding: 0,
    margin: 0,
    border: '1px solid transparent',
    borderRadius: 3,
    lineHeight: 1,
    ':focus': {
      background: colors.light,
      textIndent: 0,
      borderColor: colors.shade5,
    },
    [responsiveMediaQuery('>=xs', { webOnly: true })]: {
      borderColor: 'var(--color-primary)',
      padding: '4px 0',
      top: -4,
      ':focus': {
        borderColor: 'var(--color-primary)',
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
});

/**
 * The filter price range slider label component.
 * @param {Object} props The component props.
* @returns {JSX.Element}
 */
function Label(props) {
  const { classes } = useStyles();
  const {
    priceLength, priceMax, priceMin, onChange,
  } = props;
  const [minValue, setMinValue] = useState(priceMin);
  const [maxValue, setMaxValue] = useState(priceMax);
  const [minOffset, setMinOffset] = useState(0);
  const [maxOffset, setMMaxOffset] = useState(0);
  const minRef = useRef(null);
  const maxRef = useRef(null);

  // Set new values, when prices change from outside.
  useEffect(() => {
    setMinValue(priceMin);
    setMaxValue(priceMax);
  }, [priceMin, priceMax]);

  // Store the leftOffset when the reference changes.
  useEffect(() => {
    setMinOffset(minRef.current.offsetLeft);
    setMMaxOffset(maxRef.current.offsetLeft);
  }, [minRef, maxRef]);

  /**
   * Selects the field content on click.
   * @param {SyntheticEvent} event The click event object.
   */
  function handleFieldClick({ target }) {
    target.setSelectionRange(0, target.value.length);
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
    <div className={classes.editableContainer}>
      <span className={classes.srOnly}>
        {i18n.text('price.range', {
          fromPrice: i18n.price(priceMin, currency, false),
          toPrice: i18n.price(priceMax, currency, false),
        })}
      </span>
      <I18n.Text string="price.range" aria-hidden>
        <I18n.Placeholder forKey="fromPrice">
          <span className={classes.price} style={{ minWidth: priceLength }} ref={minRef}>
            <I18n.Price price={priceMin} currency={currency} fractions={false} />
          </span>
        </I18n.Placeholder>
        <I18n.Placeholder forKey="toPrice">
          <span className={classes.price} style={{ minWidth: priceLength }} ref={maxRef}>
            <I18n.Price price={priceMax} currency={currency} fractions={false} />
          </span>
        </I18n.Placeholder>
      </I18n.Text>
      <span aria-hidden hidden id="price-slider-currency-label">
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
        style={{
          width: priceLength,
          left: minOffset,
        }}
        className={classes.editableField}
        aria-label={i18n.text('price.range_from')}
        aria-describedby="price-slider-currency-label"
      />
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        id="priceMax"
        name="priceMax"
        value={maxValue}
        onChange={handleChangeMax}
        onClick={handleFieldClick}
        style={{
          width: priceLength,
          left: maxOffset,
        }}
        className={classes.editableField}
        aria-label={i18n.text('price.range_to')}
        aria-describedby="price-slider-currency-label"
      />
    </div>
  );
}

Label.propTypes = {
  onChange: PropTypes.func.isRequired,
  priceLength: PropTypes.string.isRequired,
  priceMax: PropTypes.number.isRequired,
  priceMin: PropTypes.number.isRequired,
};

export default memo(Label);
