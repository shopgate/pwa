import { connect } from 'react-redux';
import { makeGetLocation } from '@shopgate/engage/locations';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => {
  const getLocation = makeGetLocation();

  return (state, props) => {
    const { order: { lineItems = [] } } = props;

    const locationId = lineItems
      .find(lineItem => lineItem?.fulfillmentLocationCode !== undefined)?.fulfillmentLocationCode;

    return {
      location: getLocation(state, { locationId }),
    };
  };
};

export default connect(makeMapStateToProps);
