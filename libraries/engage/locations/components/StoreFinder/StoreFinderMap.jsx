import React, { useContext, useMemo, useCallback } from 'react';
import Leaflet from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import MapMarkerIcon from '@shopgate/pwa-ui-shared/icons/MapMarkerIcon';
import { StoreFinderContext } from '../../locations.context';
import { container, marker, markerSelected } from './StoreFinderMap.style';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderMap = () => {
  const {
    locations,
    selectedLocation,
    selectLocation,
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

  const positions = useMemo(() => locations.map((location) => {
    const { code, latitude, longitude } = location;
    return {
      code,
      location,
      position: [latitude, longitude],
    };
  }), [locations]);

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
        { positions.map(({ position, code, location }) => {
          const icon = selectedLocation.code === code ? markerIconSelected : makerIcon;

          return (
            <Marker
              key={code}
              icon={icon}
              position={position}
              onclick={(e) => { onMarkerClick(e, location); }}
            />
          );
        })}
      </Map>

    </div>

  );
};

export default StoreFinderMap;
