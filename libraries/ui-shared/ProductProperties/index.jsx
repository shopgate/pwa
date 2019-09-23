import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';

/**
 * The Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Properties = ({ lineClamp, properties }) => {
  if (!properties.length) {
    return null;
  }

  return (
    <ul>
      {properties.map(({ label, value }) => (
        <li key={`${label}-${value}`}>
          {lineClamp &&
            <Ellipsis rows={lineClamp}>
              {`${label}: ${value}`}
            </Ellipsis>
          }
          {!lineClamp && `${label}: ${value}`}
        </li>
      ))}
    </ul>
  );
};

Properties.propTypes = {
  /** Truncate property value at a specific number of lines */
  lineClamp: PropTypes.number,
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

Properties.defaultProps = {
  lineClamp: null,
  properties: [],
};

export default Properties;
