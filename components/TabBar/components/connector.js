import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';

const mapDispatchToProps = {
  historyPush: params => historyPush(params),
};

export default connect(null, mapDispatchToProps);

