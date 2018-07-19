import { connect } from 'react-redux';

/**
 * @param {Object} state state
 * @return {{addresses: Array}}
 */
const mapStateToProps = state => ({
  addresses: [],
});

export default connect(mapStateToProps);
