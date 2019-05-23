import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getVariantAvailabilityByCharacteristics } from '@shopgate/engage/product';

/**
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  availability: getVariantAvailabilityByCharacteristics(state, props),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.availability, next.availability)) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
