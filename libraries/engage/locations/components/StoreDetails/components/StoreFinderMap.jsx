import React, { useCallback, useMemo, useContext } from 'react';
import {
  Circle, MapContainer, Marker, TileLayer,
} from 'react-leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import '../../../assets/leaflet.css';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';
import Leaflet from 'leaflet';
import { renderToString } from 'react-dom/server';
import MapMarkerIcon from '@shopgate/pwa-ui-shared/icons/MapMarkerIcon';
import {
  container, markerSelected,
} from './StoreFinderMap.style';
import { MAP_RADIUS_KM } from '../../../constants';
import { StoreDetailsContext } from '../../../providers/StoreDetailsContext';

Leaflet.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);

/**
 * @returns {JSX.Element}
 */
const StoreFinderMap = () => {
  const { routeLocation } = useContext(StoreDetailsContext);

  const iconHTML = useMemo(() => renderToString(<MapMarkerIcon />), []);

  const markerIconSelected = useMemo(() => Leaflet.divIcon({
    html: iconHTML,
    className: markerSelected,
    iconSize: [40, 40],
  }), [iconHTML]);

  const { code, latitude, longitude } = routeLocation || {};

  const viewport = useMemo(() => {
    if (!latitude || !longitude) {
      return null;
    }

    return [latitude, longitude];
  }, [latitude, longitude]);

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

  const radiusinMeters = MAP_RADIUS_KM * 1000;

  const bounds = useMemo(() => {
    if (!viewport || !MAP_RADIUS_KM) {
      return null;
    }
    return createBounds(viewport, radiusinMeters);
  },
  [createBounds, radiusinMeters, viewport]);

  const debug = false;

  if (!routeLocation) {
    return null;
  }

  return (
    <div className={container} aria-hidden>
      <MapContainer
        center={viewport}
        bounds={bounds}
        className={container}
        whenCreated={handleMapCreated}
      >
        {debug && (
        <Circle
          center={viewport}
          radius={radiusinMeters}
          color="blue"
        />
        )}
        <TileLayer
          attribution='&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          key={code}
          icon={markerIconSelected}
          position={[latitude, longitude]}
        />
      </MapContainer>
    </div>
  );
};

export default StoreFinderMap;
