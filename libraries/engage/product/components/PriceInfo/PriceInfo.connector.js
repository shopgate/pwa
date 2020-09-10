import { connect } from 'react-redux';
import { makeGetShopSettingByKey } from '../../../core/selectors/shopSettings';
import { SHOP_SETTING_DISPLAY_PRICE_PER_MEASURE_UNIT } from '../../../core/constants';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getShopSetting = makeGetShopSettingByKey(
    SHOP_SETTING_DISPLAY_PRICE_PER_MEASURE_UNIT,
    false
  );

  return (state, props) => ({
    displayPricePerMeasureUnit: getShopSetting(state, props),
  });
};

export default connect(makeMapStateToProps);
