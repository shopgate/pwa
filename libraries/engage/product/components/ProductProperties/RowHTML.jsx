import React from 'react';
import PropTypes from 'prop-types';
import { HtmlSanitizer } from '@shopgate/engage/components';

/**
 * Renders a single properties row with HTML content.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const RowHTML = ({ value, label }) => (
  <tr className="engage__product__product-property" data-type="html" data-label={label}>
    <td colSpan={2}>
      <HtmlSanitizer>
        {value}
      </HtmlSanitizer>
    </td>
  </tr>
);

RowHTML.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(RowHTML);
