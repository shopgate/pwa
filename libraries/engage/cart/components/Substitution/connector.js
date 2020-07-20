// @flow
import { connect } from 'react-redux';
import { getSubstitutionPreferencesEnabled } from '@shopgate/engage/core/selectors/merchantSettings';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The populated component props.
 */
const mapStateToProps = state => ({
  substitutionPreferencesEnabled: getSubstitutionPreferencesEnabled(state),
});

export default connect(mapStateToProps);
