import { connect } from 'react-redux';
import { QUICKLINKS_MENU } from '@shopgate/engage/core';
import { getMenuById } from'@shopgate/engage/core';

const props = {
  id: QUICKLINKS_MENU,
};

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  entries: getMenuById(state, props),
});

export default connect(mapStateToProps);
