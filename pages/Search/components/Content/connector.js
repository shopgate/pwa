import { connect } from 'react-redux';
import { showNoResults, showFilterBar } from '../../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  showFilterBar: showFilterBar(state, props),
  showNoResults: showNoResults(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.showNoResults !== next.showNoResults) {
    return false;
  }

  if (prev.showFilterBar !== next.showFilterBar) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
