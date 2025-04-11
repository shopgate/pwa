import PropTypes from 'prop-types';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';

/**
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ContentWrapper = ({ children, isOpen }) => {
  useTrackModalState(isOpen);

  return children;
};

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ContentWrapper;
