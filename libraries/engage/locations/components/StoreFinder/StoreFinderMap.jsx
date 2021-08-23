import React, { useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../../assets/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import Leaflet from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import MapMarkerIcon from '@shopgate/pwa-ui-shared/icons/MapMarkerIcon';
import { StoreFinderContext } from '../../locations.context';
import {
  container, marker, markerSelected, userPosition as userPositionStyle,
} from './StoreFinderMap.style';

Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderMap = ({ showUserPosition }) => {
  const {
    locations,
    selectedLocation,
    changeLocation,
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
    const { code: selectedCode } = selectedLocation || {};
    const icon = selectedCode === code ? markerIconSelected : makerIcon;
    return {
      code,
      location,
      icon,
      position: [latitude, longitude],
    };
  }), [locations, makerIcon, markerIconSelected, selectedLocation]);

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
    const { latitude, longitude } = selectedLocation || locations[0] || {};

    if (!latitude || !longitude) {
      return userPosition?.position || null;
    }

    return [latitude, longitude];
  }, [locations, selectedLocation, userPosition]);

  const onMarkerClick = useCallback((event, location) => {
    changeLocation(location, true);
  }, [changeLocation]);

  return (
    <div className={container}>
      <Map
        center={viewport}
        zoom={15}
        className={container}
        gestureHandling={Leaflet.Browser.mobile}
        touchZoom
      >
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
