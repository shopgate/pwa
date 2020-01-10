import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { RangeSlider } from '@shopgate/engage/components';
import { FilterItem } from '@shopgate/engage/filter';
import Label from './components/Label';
import styles from './style';

/**
 * The PriceSlider component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PriceSlider(props) {
  const {
    id, max, min, onChange, value,
  } = props;
  const [sliderValue, setSliderValue] = useState(value || [min, max]);

  useEffect(() => setSliderValue(value), [value]);

  /**
   * The callback function that is given to the RangeSlider.
   * @param {Array} val The lower and upper boundary of the set range.
   */
  const handleChange = useCallback((val) => {
    const roundedValue = [
      Math.floor(val[0]),
      Math.ceil(val[1]),
    ];

    setSliderValue(val);
    onChange(id, roundedValue);
  }, [id, onChange]);

  /**
   * The min and max price need to be rounded before they are passed to the I18n component,
   * since it rounds to the full nearest number when fractions are deactivated.
   */
  const priceMin = Math.floor(sliderValue[0] / 100);
  const priceMax = Math.ceil(sliderValue[1] / 100);

  /**
   * Calculate the necessary maximum size for the price value.
   * The size is 2 characters more than the max possible number length
   * to reserve space for the currency symbol and a little spacing around.
   */
  const priceLength = `${(max / 100).toString().length + 2}ch`;

  return (
    <FilterItem>
      <div className={styles.wrapper} data-test-id="priceRangeSlider">
        <Label
          priceLength={priceLength}
          priceMax={priceMax}
          priceMin={priceMin}
          onChange={handleChange}
        />
        <RangeSlider
          classNames={styles.rangeSlider}
          easing="exponential"
          factor={3}
          max={max}
          min={min}
          onChange={handleChange}
          value={sliderValue}
        />
      </div>
    </FilterItem>
  );
}

PriceSlider.propTypes = {
  id: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.number),
};

PriceSlider.defaultProps = {
  max: 100,
  min: 0,
  onChange: () => { },
  value: null,
};

export default PriceSlider;
