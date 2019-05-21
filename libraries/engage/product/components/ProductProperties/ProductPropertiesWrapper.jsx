import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { container, containerDense } from './ProductProperties.style';

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ProductPropertiesWrapper = ({ children, dense }) => (
  <div
    className={cxs({
      [container]: !dense,
      [containerDense]: dense,
    })}
  >
    <table>
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

ProductPropertiesWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
};

ProductPropertiesWrapper.defaultProps = {
  dense: false,
};

export default React.memo(ProductPropertiesWrapper);
