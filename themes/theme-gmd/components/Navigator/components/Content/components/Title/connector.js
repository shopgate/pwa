import { connect } from 'react-redux';
import { getTitle } from '@shopgate/pwa-common/selectors/ui';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  title: getTitle(state),
});

/**
 * @param {Object} next The next state.
 * @param {Object} prev The previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => (
  prev.title === next.title
);

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
