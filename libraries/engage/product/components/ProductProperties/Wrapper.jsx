import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { container, containerDense } from './style';

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Wrapper = ({ children, dense }) => (
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

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
};

Wrapper.defaultProps = {
  dense: false,
};

export default React.memo(Wrapper);
