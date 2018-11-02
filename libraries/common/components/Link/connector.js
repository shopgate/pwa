import { connect } from 'react-redux';
import { historyPush, historyReplace } from '../../actions/router';

const mapDispatchToProps = {
  historyPush: params => historyPush(params),
  historyReplace: params => historyReplace(params),
};

export default connect(null, mapDispatchToProps);
