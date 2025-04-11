import PropTypes from 'prop-types';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';

/**
 * Helper component to be used inside modal-like class components to track their visibility and
 * apply a11y optimizations to the app.
 *
 * Wrap the children of your modal-like component with this component to track its visibility
 *
 * For functional components, please use the `useTrackModalState` hook instead.
 * @param {Object} props The component props.
 * @param {boolean} [props.isVisible] Optional visibility flag to be set by the parent component
 * when it uses a visibility prop or state to toggle its visibility. Can be omitted if the
 * component mounts/unmounts based on visibility.
 * @param {ReactNode} props.children The component children.
 * @returns {JSX.Element}
 */
const ModalStateTracker = ({ children, isVisible }) => {
  useTrackModalState(isVisible);

  return children;
};

ModalStateTracker.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool,
};

ModalStateTracker.defaultProps = {
  isVisible: undefined,
};

export default ModalStateTracker;
