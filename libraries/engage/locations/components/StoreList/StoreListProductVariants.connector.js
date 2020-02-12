import { connect } from 'react-redux';
import { makeGetSelectedCharacteristic } from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getSelectedCharacteristic = makeGetSelectedCharacteristic();

  return (state, props) => ({
    selectedVariants: getSelectedCharacteristic(state, props),
  });
}

export default connect(makeMapStateToProps);
