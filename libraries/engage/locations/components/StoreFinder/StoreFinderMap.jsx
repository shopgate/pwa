import React, {
  useContext, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  Circle, MapContainer, Marker, TileLayer,
} from 'react-leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import '../../assets/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import Leaflet from 'leaflet';
import { renderToString } from 'react-dom/server';
import MapMarkerIcon from '@shopgate/pwa-ui-shared/icons/MapMarkerIcon';
import { StoreFinderContext } from '../../locations.context';
import {
  container, marker, markerSelected, userPosition as userPositionStyle,
} from './StoreFinderMap.style';

Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

/**
 * @param {Object} props The component props
 * @returns {JSX.Element}
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

  const positions = useMemo(() => locations?.map((location) => {
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
    if (!userSearch) {
      return null;
    }

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

  // TODO: should come from theme config, map viewport should adjust to new radius
  // 10 miles in meters
  const radius = 16093.4;

  // eslint-disable-next-line require-jsdoc
  const handleMapCreated = (map) => {
    map.gestureHandling.enable();

    // Enable touchZoom for mobile devices
    if (Leaflet.Browser.mobile) {
      map.touchZoom.enable();
    }
  };

  return (
    <div className={container}>
      <MapContainer
        center={viewport}
        zoom={10}
        className={container}
        whenCreated={handleMapCreated}
      >
        <Circle center={viewport} radius={radius} color="blue" />
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
            eventHandlers={{
              click: (e) => {
                onMarkerClick(e, location);
              },
            }}
          />
        ))}
        { userPosition && (
          <Marker
            key="user-position"
            icon={userPosition.icon}
            position={userPosition.position}
          />
        )}
      </MapContainer>
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
