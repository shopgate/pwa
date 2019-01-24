import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';

/**
 * The Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Properties = ({ truncate, properties }) => (
  <ul>
    {properties.map(({ label, value }) => (
      <li key={`${label}-${value}`}>
        {truncate &&
          <Ellipsis rows={truncate}>
            {label}: {value}
          </Ellipsis>
        }
        {!truncate && `${label}: ${value}`}
      </li>
    ))}
  </ul>
);

Properties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  /** Truncate property to show N lines */
  truncate: PropTypes.number,
};

Properties.defaultProps = {
  properties: [],
  truncate: null,
};

export default Properties;
