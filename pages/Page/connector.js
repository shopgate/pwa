import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getCurrentPageId } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  configs: state.page,
  pageId: getCurrentPageId(state),
});

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.configs, next.configs)) return false;
  if (!prev.pageId && next.pageId) return false;
  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
