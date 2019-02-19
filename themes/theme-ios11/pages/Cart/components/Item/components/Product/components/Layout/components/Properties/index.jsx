import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';

/**
 * The Cart Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Properties = ({ properties }) => {
  if (!properties.length) {
    return null;
  }

  return (
    <Grid.Item component="div">
      <ul>
        {properties.map(({ label, value }) => (
          <li key={`${label}-${value}`}>
            {label}: {value}
          </li>
        ))}
      </ul>
    </Grid.Item>
  );
};

Properties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

Properties.defaultProps = {
  properties: [],
};

export default Properties;
