import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getFiltersByHash } from '@shopgate/engage/filter';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  filters: getFiltersByHash(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if ((!prev.filters && next.filters) || (!isEqual(prev.filters, next.filters))) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
