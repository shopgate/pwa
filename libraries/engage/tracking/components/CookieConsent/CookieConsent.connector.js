import { connect } from 'react-redux';
import { hasCookieConsent } from '../../selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  hasCookieConsent: hasCookieConsent(state),
});

export default connect(makeMapStateToProps);
