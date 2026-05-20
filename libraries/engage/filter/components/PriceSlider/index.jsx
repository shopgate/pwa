import React, {
  useState, useEffect, useCallback, useRef, memo,
} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { RangeSlider } from '@shopgate/engage/components';
import { FilterItem } from '@shopgate/engage/filter';
import Label from './components/Label';

const { shadows, colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  wrapper: {
    padding: theme.spacing(1.5, 2),
  },
  rangeSliderContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  rangeSliderOuterRange: {
    background: colors.darkGray,
    height: 8,
    position: 'relative',
  },
  rangeSliderRange: {
    background: 'var(--color-secondary)',
    position: 'absolute',
    height: '100%',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rangeSliderHandleInner: {
    background: colors.light,
    boxShadow: shadows.filter.priceSlider,
    borderRadius: '50%',
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  rangeSliderHandleOuter: {},
}));

/**
 * The PriceSlider component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const PriceSlider = ({
  id,
  max,
  min,
  onChange,
  useLinearEasing,
  value: valueFromProps,
}) => {
  const { classes } = useStyles();

  const [value, setValue] = useState(() => {
    if (Array.isArray(valueFromProps) && valueFromProps.length > 0) {
      return valueFromProps;
    }
    return [min, max];
  });

  const prevValueProp = useRef(valueFromProps);
  useEffect(() => {
    if (!isEqual(valueFromProps, prevValueProp.current)) {
      prevValueProp.current = valueFromProps;
      if (Array.isArray(valueFromProps) && valueFromProps.length > 0) {
        setValue(valueFromProps);
      }
    }
  }, [valueFromProps]);

  const handleChange = useCallback((next) => {
    setValue(next);
    const roundedValue = [
      Math.floor(next[0]),
      Math.ceil(next[1]),
    ];
    onChange(id, roundedValue);
  }, [id, onChange]);

  const priceMin = Math.floor(value[0] / 100);
  const priceMax = Math.ceil(value[1] / 100);
  const priceLength = `${(max / 100).toString().length + 2}ch`;

  return (
    <FilterItem>
      <div className={classes.wrapper} data-test-id="priceRangeSlider">
        <Label
          priceLength={priceLength}
          priceMax={priceMax}
          priceMin={priceMin}
          onChange={handleChange}
        />
        <RangeSlider
          classNames={{
            container: classes.rangeSliderContainer,
            outerRange: classes.rangeSliderOuterRange,
            range: classes.rangeSliderRange,
            handleInner: classes.rangeSliderHandleInner,
            handleOuter: classes.rangeSliderHandleOuter,
          }}
          easing={useLinearEasing ? 'linear' : 'exponential'}
          factor={3}
          max={max}
          min={min}
          onChange={handleChange}
          value={value}
        />
      </div>
    </FilterItem>
  );
};

PriceSlider.propTypes = {
  id: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  useLinearEasing: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.number),
};

PriceSlider.defaultProps = {
  useLinearEasing: false,
  max: 100,
  min: 0,
  onChange: () => {},
  value: null,
};

export default memo(PriceSlider);
