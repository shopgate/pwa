import { connect } from 'react-redux';
import { makeGetProductPriceData, makeGetProductMapPrice } from '../..';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getProductPriceData = makeGetProductPriceData();
  const getProductMapPrice = makeGetProductMapPrice();

  return (state, props) => ({
    price: getProductPriceData(state, props),
    mapPrice: getProductMapPrice(state, props),
  });
}

export default connect(makeMapStateToProps);
