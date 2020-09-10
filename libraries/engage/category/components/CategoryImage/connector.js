import { connect } from 'react-redux';
import { getCategoryImagePlaceholder } from '@shopgate/engage/core';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The populated component props.
 */
const mapStateToProps = state => ({
  placeholderSrc: getCategoryImagePlaceholder(state),
});

export default connect(mapStateToProps);
