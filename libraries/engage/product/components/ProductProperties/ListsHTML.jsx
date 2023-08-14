import React from 'react';
import PropTypes from 'prop-types';
import { HtmlSanitizer } from '@shopgate/engage/components';

/**
 * Renders a single properties row with HTML content.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const ListsHTML = ({ properties }) => properties.map(({ label, value, type }) => (
  <div
    key={label}
    className="engage__product__product-property"
    data-type={type}
    data-label={label}
  >
    <HtmlSanitizer>
      {value}
    </HtmlSanitizer>
  </div>
));

ListsHTML.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(ListsHTML);
