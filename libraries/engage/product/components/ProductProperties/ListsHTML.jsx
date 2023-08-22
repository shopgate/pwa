import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@shopgate/engage/core';
import { HtmlSanitizer } from '@shopgate/engage/components';

/**
 * Renders a single properties row with HTML content.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const ListsHTML = ({ properties }) => {
  const { push } = useNavigation();

  const handleClick = useCallback((pathname, target) => {
    push({
      pathname,
      ...target && { state: { target } },
    });
  }, [push]);

  return properties.map(({ label, value, type }) => (
    <div
      key={label}
      className="engage__product__product-property"
      data-type={type}
      data-label={label}
    >
      <HtmlSanitizer
        settings={{
          handleClick,
          html: value,
        }}
      >
        {value}
      </HtmlSanitizer>
    </div>
  ));
};
ListsHTML.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default React.memo(ListsHTML);
