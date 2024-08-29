import { connect } from 'react-redux';
import { historyPush, historyReplace } from '../../actions/router';

const mapDispatchToProps = {
  historyPush,
  historyReplace,
};

export default connect(null, mapDispatchToProps);
