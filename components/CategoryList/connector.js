import { connect } from 'react-redux';
import { getCurrentCategories } from '@shopgate/pwa-common-commerce/category/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  categories: getCurrentCategories(state),
});

export default connect(mapStateToProps);
