import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { makeGetNearbyLocationsByRouteLocation } from '../../../selectors';
import StoresNearbyListItem from './StoresNearbyListItem';

/**
 * Maps state to props
 * @param {Object} state State
 * @returns {Object}
 */
const mapStateToProps = (state) => {
  const getLocations = makeGetNearbyLocationsByRouteLocation();
  return ({
    nearbyLocations: getLocations(state),
  });
};

const styles = {
  title: css({
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '12px',
  }),
};

/**
* Show stores nearby selected location
* @param {Object} props Props
* @param {Object[]} props.nearbyLocations Nearby locations
* @returns {JSX}
*/
const StoresNearby = (props) => {
  const { nearbyLocations } = props;

  return (
    <div>
      <div className={styles.title}>
        {i18n.text('location.storesNearby')}
      </div>
      {nearbyLocations.length > 0 && (
      <table>
        <tbody>
          {nearbyLocations.map(location => (
            <StoresNearbyListItem location={location} key={location.code} />
          )) }
        </tbody>
      </table>
      )}
      {nearbyLocations.length === 0 && (
      <div>
        {i18n.text('location.noStoresNearby')}
      </div>
      )}
    </div>
  );
};

StoresNearby.propTypes = {
  nearbyLocations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
  })),
};

StoresNearby.defaultProps = {
  nearbyLocations: [],
};

export default connect(mapStateToProps)(StoresNearby);
