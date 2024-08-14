import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

const styles = {
  root: css({
    position: 'absolute !important',
    height: '1px',
    width: '1px',
    overflow: 'hidden',
    clip: 'rect(1px, 1px, 1px, 1px)',
    whiteSpace: 'nowrap',
  }),
};

/**
 * This component surrounds its children with a wrapper that takes care that they are not visible
 * on the screen, but still accessible by a screen reader.
 * @param {Object} props The component props
 * @param {Object} [props.tag='span'] The tag to be used for the component
 * @param {Object} props.children Component children
 * @returns {JSX.Element}
 */
const VisuallyHidden = ({
  tag = 'span',
  children,
}) => React.createElement(
  tag,
  { className: styles.root },
  children
);

VisuallyHidden.propTypes = {
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
};

VisuallyHidden.defaultProps = {
  tag: 'span',
};

export default VisuallyHidden;
