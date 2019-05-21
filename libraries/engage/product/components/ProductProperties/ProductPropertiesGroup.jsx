import React from 'react';
import PropTypes from 'prop-types';
import { subgroup } from './ProductProperties.style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductPropertiesGroup = ({ group }) => (
  <tr>
    <td colSpan="2" className={subgroup}>{group}</td>
  </tr>
);

ProductPropertiesGroup.propTypes = {
  group: PropTypes.string.isRequired,
};

export default React.memo(ProductPropertiesGroup);
