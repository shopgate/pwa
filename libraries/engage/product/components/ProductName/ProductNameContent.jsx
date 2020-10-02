import React from 'react';
import PropTypes from 'prop-types';
import { Ellipsis, ConditionalWrapper } from '@shopgate/engage/components';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ProductNameContent = ({ name, ellipsis, rows }) => (
  <ConditionalWrapper
    condition={ellipsis}
    wrapper={children =>
      <Ellipsis rows={rows !== null ? rows : undefined}>
        {children}
      </Ellipsis>
      }
  >
    <span dangerouslySetInnerHTML={{ __html: name }} />
  </ConditionalWrapper>
);

ProductNameContent.propTypes = {
  ellipsis: PropTypes.bool,
  name: PropTypes.string,
  rows: PropTypes.number,
};

ProductNameContent.defaultProps = {
  name: null,
  ellipsis: true,
  rows: null,
};

export default ProductNameContent;
