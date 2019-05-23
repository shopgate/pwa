import React from 'react';
import PropTypes from 'prop-types';
import { subgroup } from './style';

/**
 * Renders a product properties group header.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Group = ({ group }) => (
  <tr>
    <td colSpan="2" className={subgroup}>{group}</td>
  </tr>
);

Group.propTypes = {
  group: PropTypes.string.isRequired,
};

export default React.memo(Group);
