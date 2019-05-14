import { connect } from 'react-redux';
import { makeGetProductProperties } from '../../selectors/product';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getProductProperties = makeGetProductProperties();

  return (state, props) => ({
    properties: getProductProperties(state, props),
  });
}

export default connect(makeMapStateToProps);
