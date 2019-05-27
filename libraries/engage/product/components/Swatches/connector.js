import { connect } from 'react-redux';
import { makeGetProductCharacteristics } from '../../selectors/product';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getProductCharacteristics = makeGetProductCharacteristics();

  return (state, props) => ({
    characteristics: getProductCharacteristics(state, props),
  });
}

export default connect(makeMapStateToProps);
