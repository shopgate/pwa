import React from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import { container, containerDense } from './style';

/**
 * Renders the general properties wrapper table.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX.Element}
 */
const Wrapper = ({ children, dense }, context) => {
  const { __ } = context.i18n();
  return (
    <div
      className={cxs({
        [container]: !dense,
        [containerDense]: dense,
      })}
    >
      <table role="region" aria-label={__('product.sections.properties')}>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  dense: PropTypes.bool,
};

Wrapper.defaultProps = {
  dense: false,
};

Wrapper.contextTypes = {
  i18n: PropTypes.func,
};

export default React.memo(Wrapper);
