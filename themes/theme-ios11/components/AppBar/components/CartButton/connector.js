import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';

const mapDispatchToProps = {
  navigate: () => historyPush({ pathname: CART_PATH }),
};

export default connect(null, mapDispatchToProps);
