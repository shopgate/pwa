import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getPageConfigById } from '@shopgate/pwa-common/selectors/page';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  configs: getPageConfigById(state, props),
});

/**
 * Check to see if the page configs have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.configs, next.configs)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
