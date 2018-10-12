import { connect } from 'react-redux';
import { historyReplace } from '@shopgate/pwa-common/actions/router';

const mapDispatchToProps = {
  historyReplace: params => historyReplace(params),
};

export default connect(null, mapDispatchToProps);
