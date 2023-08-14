import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { container, containerDense } from './style';

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Wrapper = ({
  children, dense, groupName, htmlOnly,
}) => (
  <div
    className={cxs('engage__product__product-property-group', {
      [container]: !dense,
      [containerDense]: dense,
    })}
    data-group-name={groupName.toLowerCase()}
  >
    { htmlOnly ? children : (
      <table>
        <thead />
        <tbody>
          {children}
        </tbody>
      </table>
    )}
  </div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
  groupName: PropTypes.string,
  htmlOnly: PropTypes.bool,
};

Wrapper.defaultProps = {
  dense: false,
  htmlOnly: false,
  groupName: '',
};

export default React.memo(Wrapper);
