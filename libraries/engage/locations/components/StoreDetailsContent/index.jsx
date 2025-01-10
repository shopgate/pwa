import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPreferredLocation } from '@shopgate/engage/locations/selectors';
import StoreDetails from './components/StoreDetails';
import StoreLocationMap from './components/StoreLocationMap';
import StoresNearby from './components/StoresNearby';

const styles = {
};
/**
 * @param {Object} state .
 * @returns {Object}
 */
const mapStateToProps = state => ({
  preferredLocation: getPreferredLocation(state),
});

/**
 * @param {Object} props .
 * @returns {JSX}
 */
const StoreDetialsContent = () => (
  <div className={styles.container}>
    <StoreDetails />
    <StoreLocationMap />
    <StoresNearby />
  </div>

);

StoreDetialsContent.propTypes = {
  preferredLocation: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    operationHours: PropTypes.shape(),
  }),
};

StoreDetialsContent.defaultProps = {
  preferredLocation: null,
};
export default connect(mapStateToProps)(StoreDetialsContent);
