import React, { useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Leaflet from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import MapMarkerIcon from '@shopgate/pwa-ui-shared/icons/MapMarkerIcon';
import { StoreFinderContext } from '../../locations.context';
import {
  container, marker, markerSelected, userPosition as userPositionStyle,
} from './StoreFinderMap.style';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderMap = ({ showUserPosition }) => {
  const {
    locations,
    selectedLocation,
    selectLocation,
    userSearch,
  } = useContext(StoreFinderContext);

  const iconHTML = useMemo(() => renderToString(<MapMarkerIcon />), []);

  const makerIcon = useMemo(() => Leaflet.divIcon({
    html: iconHTML,
    className: marker,
    iconSize: [40, 40],
  }), [iconHTML]);

  const markerIconSelected = useMemo(() => Leaflet.divIcon({
    html: iconHTML,
    className: markerSelected,
    iconSize: [40, 40],
  }), [iconHTML]);

  const userPositionIcon = useMemo(() => Leaflet.divIcon({
    html: '<div/>',
    className: userPositionStyle,
    iconSize: [20, 20],
  }), []);

  const positions = useMemo(() => locations.map((location) => {
    const { code, latitude, longitude } = location;
    const icon = selectedLocation.code === code ? markerIconSelected : makerIcon;
    return {
      code,
      location,
      icon,
      position: [latitude, longitude],
    };
  }), [locations, makerIcon, markerIconSelected, selectedLocation.code]);

  const userPosition = useMemo(() => {
    const { geolocation } = userSearch;

    if (!geolocation || !showUserPosition) {
      return null;
    }

    const { latitude, longitude } = geolocation;

    return {
      icon: userPositionIcon,
      position: [latitude, longitude],
    };
  }, [showUserPosition, userPositionIcon, userSearch]);

  const viewport = useMemo(() => {
    const { latitude, longitude } = selectedLocation || locations[0];

    return [latitude, longitude];
  }, [locations, selectedLocation]);

  const onMarkerClick = useCallback((event, location) => {
    selectLocation(location, true);
  }, [selectLocation]);

  return (
    <div className={container}>
      <Map center={viewport} zoom={14} className={container}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { positions.map(({
          position, code, location, icon,
        }) => (
          <Marker
            key={code}
            icon={icon}
            position={position}
            onclick={(e) => { onMarkerClick(e, location); }}
          />
        ))}
        { userPosition && (
          <Marker
            key="user-position"
            icon={userPosition.icon}
            position={userPosition.position}
          />
        )}
      </Map>
    </div>
  );
};

StoreFinderMap.propTypes = {
  showUserPosition: PropTypes.bool,
};

StoreFinderMap.defaultProps = {
  showUserPosition: true,
};

export default StoreFinderMap;
