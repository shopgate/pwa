import React from 'react';
import PropTypes from 'prop-types';
import { tableCell } from './style';

/**
 * Renders a single properties row.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Row = ({ label, value }) => (
  <tr key={`${label}${value}`}>
    <td className={tableCell}><span dangerouslySetInnerHTML={{ __html: label }} /></td>
    <td className={tableCell} data-test-id={`property: ${value}`}><span dangerouslySetInnerHTML={{ __html: value }} /></td>
  </tr>
);

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(Row);
