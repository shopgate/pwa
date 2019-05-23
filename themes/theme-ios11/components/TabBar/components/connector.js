import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';

const mapDispatchToProps = {
  historyPush: params => historyPush(params),
};

export default connect(null, mapDispatchToProps);

