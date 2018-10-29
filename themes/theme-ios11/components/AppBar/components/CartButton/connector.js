import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';

const mapDispatchToProps = {
  navigate: () => historyPush({ pathname: CART_PATH }),
};

export default connect(null, mapDispatchToProps);
