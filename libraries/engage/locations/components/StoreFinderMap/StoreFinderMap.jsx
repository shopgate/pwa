import React, { useCallback, useContext, useMemo } from 'react';
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
import { useSelector } from 'react-redux';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { StoreFinderContext } from '../../locations.context';
import {
  container, marker, markerSelected, userPosition as userPositionStyle,
} from './StoreFinderMap.style';
import { getLocationByRoute, getNearbyLocationsByRoute } from '../../selectors';

Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

/**
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const StoreFinderMap = ({ showUserPosition }) => {
  const {
    changeLocation,
    userSearch,
  } = useContext(StoreFinderContext);

  const selectedLocation = useSelector(getLocationByRoute);
  const locations = useSelector(state => getNearbyLocationsByRoute(state));
  if (!locations.some(loc => loc.code === selectedLocation.code)) {
    locations.push(selectedLocation);
  }

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

  // default is 10 miles in meters
  const { radiusInMeters } = appConfig.storeMap;

  /**
   * Enables touch and gestures on the map
   * @param {Object} map available parameters for the map
   */
  const handleMapCreated = (map) => {
    map.gestureHandling.enable();

    if (Leaflet.Browser.mobile) {
      map.touchZoom.enable();
    }
  };

  /**
   * Creates coordinates for a bounding box around a center point
   * @param {Array} center The center point
   * @param {number} distanceInMeter The distance in meters
   * @returns {Array} The bounds
   */
  const createBounds = useCallback(([lat, lng], distanceInMeter) => {
    const EARTH_RADIUS_KM = 6371;
    const distanceInKm = distanceInMeter / 1000;
    const distanceToBoundaryInKm = distanceInKm / 2;

    const latInRadians = lat * (Math.PI / 180);

    const deltaLat = (distanceToBoundaryInKm / EARTH_RADIUS_KM) * (180 / Math.PI);
    const deltaLng = (distanceToBoundaryInKm / EARTH_RADIUS_KM)
      * (180 / Math.PI)
      / Math.cos(latInRadians);

    return [
      [lat - deltaLat, lng - deltaLng],
      [lat + deltaLat, lng + deltaLng],
    ];
  }, []);

  const bounds = useMemo(() => createBounds(viewport, radiusInMeters),
    [createBounds, viewport, radiusInMeters]);

  const debug = false;

  return (
    <div className={container}>
      <MapContainer
        center={viewport}
        bounds={bounds}
        className={container}
        whenCreated={handleMapCreated}
      >
        {debug && (
        <Circle
          center={viewport}
          radius={radiusInMeters}
          color="blue"
        />
        )}
        <TileLayer
          attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
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
