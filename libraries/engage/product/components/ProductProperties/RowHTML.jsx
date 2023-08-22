import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@shopgate/engage/core';
import { HtmlSanitizer } from '@shopgate/engage/components';

/**
 * Renders a single properties row with HTML content.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const RowHTML = ({ value, label }) => {
  const { push } = useNavigation();

  const handleClick = useCallback((pathname, target) => {
    push({
      pathname,
      ...target && { state: { target } },
    });
  }, [push]);

  return (
    <tr className="engage__product__product-property" data-type="html" data-label={label}>
      <td colSpan={2}>
        <HtmlSanitizer
          settings={{
            handleClick,
            html: value,
          }}
        >
          {value}
        </HtmlSanitizer>
      </td>
    </tr>
  );
};
RowHTML.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default React.memo(RowHTML);
