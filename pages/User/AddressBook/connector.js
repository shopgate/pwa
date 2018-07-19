import { connect } from 'react-redux';

/**
 * @param {Object} state state
 * @return {{hasAddresses: boolean}}
 */
const mapStateToProps = state => ({
  hasAddresses: false,
});

export default connect(mapStateToProps);
