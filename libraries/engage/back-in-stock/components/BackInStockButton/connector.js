import { connect } from 'react-redux';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import grantPushPermissions from '@shopgate/engage/core/actions/grantPushPermissions';

const mapDispatchToProps = {
  addBackInStockSubscription,
  grantPushPermissions,

};

export default connect(null, mapDispatchToProps);
