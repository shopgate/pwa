import { connect } from 'react-redux';
import { historyReset } from '@shopgate/pwa-common/actions/router';

const mapDispatchToProps = {
  historyReset,
};

export default connect(null, mapDispatchToProps);
