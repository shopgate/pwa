import { connect } from 'react-redux';
import { isCategoryEmpty } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  isVisible: isCategoryEmpty(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev the previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.isVisible !== next.isVisible) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
