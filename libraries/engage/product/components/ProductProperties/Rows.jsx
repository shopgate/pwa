import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

/**
 * Renders rows of product properties.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Rows = ({ properties }) => properties
  .map(({ value, label }) => (
    <Row key={`${label}-${value}`} label={label} value={value} />
  ));

Rows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(Rows);
