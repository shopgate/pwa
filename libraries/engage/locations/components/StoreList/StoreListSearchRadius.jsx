import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { option } from './StoreListSearchRadius.style';
import { selectContainer, select } from './StoreListSearch.style';
import connector from './StoreListSearchRadius.connector';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreListSearchRadius = ({ radius, unitSystem, setRadius }) => {
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
    <div className={selectContainer}>
      <select
        name="store_list_search_radius"
        value={searchRadius || ''}
        className={select}
        onChange={handleRadiusChange}
      >
        { options.map(({ value, label }) => (
          <option className={option} value={value} key={label}>{label}</option>
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
