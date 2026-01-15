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
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <td colSpan="2" className={subgroup}>
      <span dangerouslySetInnerHTML={{ __html: group }} />
    </td>
  </tr>
);

Group.propTypes = {
  group: PropTypes.string.isRequired,
};

export default React.memo(Group);
