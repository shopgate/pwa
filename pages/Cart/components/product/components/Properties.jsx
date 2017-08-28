import React, { PropTypes } from 'react';
import { Grid } from 'Library/components';

/**
 * The ProductProperties component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ProductProperties = props => (
  <Grid.Item>
    <ul>
      {props.properties.map(({ label, value }) =>
        <li key={`${label}-${value}`}>
          {label}: {value}
        </li>
      )}
    </ul>
    <div>&nbsp;</div>
  </Grid.Item>
);

ProductProperties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

ProductProperties.defaultProps = {
  properties: [],
};

export default ProductProperties;
