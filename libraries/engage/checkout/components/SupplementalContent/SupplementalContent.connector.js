import { connect } from 'react-redux';
import {
  makeGetShopSettingByKey,
  SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT,
} from '@shopgate/engage/core';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getShopSettingsByKey = makeGetShopSettingByKey(SHOP_SETTING_ORDER_SUPPLEMENTAL_CONTENT);

  return (state, props) => ({
    text: getShopSettingsByKey(state, props),
  });
};

export default connect(makeMapStateToProps);
