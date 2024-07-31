import { connect } from 'react-redux';
import {
  hasWebBridge,
  makeGetShopSettingByKey,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP,
  SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB,
} from '@shopgate/engage/core';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getShowShopLogoInApp = makeGetShopSettingByKey(SHOP_SETTING_SHOW_SHOP_LOGO_IN_APP);
  const getShowShopLogoInWeb = makeGetShopSettingByKey(SHOP_SETTING_SHOW_SHOP_LOGO_IN_WEB);

  return state => ({
    showLogo: hasWebBridge() ? getShowShopLogoInWeb(state) : getShowShopLogoInApp(state),
  });
};

export default connect(makeMapStateToProps);
