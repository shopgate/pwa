import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';
import RowHTML from './RowHTML';

/**
 * Renders rows of product properties.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Rows = ({ properties }) => properties
  .map(({ value, label, type }) => {
    if (type === 'html') {
      return <RowHTML key={label} value={value} label={label} />;
    }

    return <Row key={`${label}-${value}`} label={label} value={value} type={type} />;
  });

Rows.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(Rows);
