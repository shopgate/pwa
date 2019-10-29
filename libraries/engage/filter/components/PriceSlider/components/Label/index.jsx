import React, {
  memo, useState, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from '../../style';

const { currency } = appConfig;

/**
 * The filter price range slider label component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Label(props) {
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

  return (
    <div className={styles.editableContainer}>
      <span className={styles.srOnly}>
        {i18n.text('price.range', {
          fromPrice: i18n.price(priceMin, currency, false),
          toPrice: i18n.price(priceMax, currency, false),
        })}
      </span>
      <I18n.Text string="price.range" aria-hidden>
        <I18n.Placeholder forKey="fromPrice">
          <span className={styles.price} style={{ minWidth: priceLength }} ref={minRef}>
            <I18n.Price price={priceMin} currency={currency} fractions={false} />
          </span>
        </I18n.Placeholder>
        <I18n.Placeholder forKey="toPrice">
          <span className={styles.price} style={{ minWidth: priceLength }} ref={maxRef}>
            <I18n.Price price={priceMax} currency={currency} fractions={false} />
          </span>
        </I18n.Placeholder>
      </I18n.Text>
      <input
        type="text"
        id="priceMin"
        name="priceMin"
        value={minValue}
        onChange={handleChangeMin}
        onClick={handleFieldClick}
        style={{
          width: priceLength,
          left: minOffset,
        }}
        className={styles.editableField}
        aria-label={i18n.text('price.range_from')}
      />
      <input
        type="text"
        id="priceMax"
        name="priceMax"
        value={maxValue}
        onChange={handleChangeMax}
        onClick={handleFieldClick}
        style={{
          width: priceLength,
          left: maxOffset,
        }}
        className={styles.editableField}
        aria-label={i18n.text('price.range_to')}
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
