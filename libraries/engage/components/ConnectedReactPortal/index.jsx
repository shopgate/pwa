import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const node = document.getElementById('portals');

/**
 * The connected react portal component rendering its children into a react portal node.
 * @param {Object} props The component props
 * @param {boolean} props.isOpened Whether the portal is open
 * @param {React.ReactNode} props.children The children to render inside the portal
 * @private
 * @returns {React.ReactPortal|null}
 */
const ConnectedReactPortal = ({ children, isOpened }) => {
  if (!isOpened) return null;

  return createPortal(children, node);
};

ConnectedReactPortal.propTypes = {
  children: PropTypes.node,
  isOpened: PropTypes.bool,
};

ConnectedReactPortal.defaultProps = {
  children: null,
  isOpened: false,
};

export default ConnectedReactPortal;
