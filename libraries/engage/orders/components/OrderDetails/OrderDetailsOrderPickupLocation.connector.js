import { connect } from 'react-redux';
import { makeGetLocation } from '@shopgate/engage/locations';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => {
  const getLocation = makeGetLocation((_, props) => props.locationCode);

  return (state, props) => {
    const { order: { lineItems = [] } } = props;

    const locationCode = lineItems
      .find(lineItem => lineItem?.fulfillmentLocationCode !== undefined)?.fulfillmentLocationCode;

    return {
      location: getLocation(state, { locationCode }),
    };
  };
};

export default connect(makeMapStateToProps);
