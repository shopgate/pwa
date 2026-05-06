import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import connector from './StoreListSearchRadius.connector';

const useStyles = makeStyles()(theme => ({
  selectContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
    '&:after': {
      zIndex: 2,
      content: '""',
      position: 'absolute',
      display: 'block',
      top: '50%',
      right: theme.spacing(1.5),
      transform: 'translate3d(0, -25%, 0)',
      width: 5,
      height: 5,
      border: '5px solid transparent',
      borderTopColor: themeColors.shade6,
    },
  },
  select: {
    appearance: 'none',
    border: `1px solid ${themeColors.shade7}`,
    padding: theme.spacing(0, 4, 0, 1.5),
    color: themeColors.shade11,
    fontSize: '1rem',
    borderRadius: 4,
    width: '100%',
    outline: 0,
  },
  option: {},
}));

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreListSearchRadius = ({ radius, unitSystem, setRadius }) => {
  const { classes } = useStyles();
  const [searchRadius, setSearchRadius] = useState(radius);

  const handleRadiusChange = useCallback((event) => {
    const value = parseInt(event.target.value, 10) || null;

    setSearchRadius(value);
    setRadius(value);
  }, [setRadius]);

  const options = useMemo(() => {
    let values;
    let placeholder;

    if (unitSystem === 'metric') {
      values = [5, 10, 25, 50, 100];
      placeholder = 'locations.radius_km';
    } else {
      values = [10, 25, 50, 100];
      placeholder = 'locations.radius_mi';
    }

    const result = values.map(value => ({
      value,
      label: i18n.text(placeholder, { radius: value }),
    }));

    return [
      {
        value: '',
        label: i18n.text('locations.radius'),
      },
      ...result,
    ];
  }, [unitSystem]);

  return (
    <div className={classes.selectContainer}>
      <select
        name="store_list_search_radius"
        value={searchRadius || ''}
        className={classes.select}
        onChange={handleRadiusChange}
      >
        { options.map(({ value, label }) => (
          <option className={classes.option} value={value} key={label}>{label}</option>
        ))}
      </select>
    </div>

  );
};

StoreListSearchRadius.propTypes = {
  setRadius: PropTypes.func.isRequired,
  radius: PropTypes.number,
  unitSystem: PropTypes.string,
};

StoreListSearchRadius.defaultProps = {
  radius: null,
  unitSystem: null,
};

export default connector(StoreListSearchRadius);
