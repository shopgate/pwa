import { connect } from 'react-redux';
import { makeGetShopSettingByKey } from '@shopgate/engage/settings/selectors/shopSettings';
import { SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT } from '@shopgate/engage/settings/constants/shopSettings';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getShopSettingsByKey = makeGetShopSettingByKey(SHOP_SETTING_CART_SUPPLEMENTAL_CONTENT);

  return (state, props) => ({
    text: getShopSettingsByKey(state, props),
  });
};

export default connect(makeMapStateToProps);
