import { connect } from 'react-redux';
import { makeGetProductSwatches } from '../../selectors/swatches';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getProductSwatches = makeGetProductSwatches();

  return (state, props) => ({
    swatches: getProductSwatches(state, props),
  });
}

export default connect(makeMapStateToProps);
