import React, { useContext, useMemo, useCallback } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import HomeIcon from '@shopgate/pwa-ui-shared/icons/HomeIcon';
import { FulfillmentContext } from '../../locations.context';
import { container } from './StoreLocationFinderMap.style';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreLocationFinderMap = () => {
  const { locations } = useContext(FulfillmentContext);

  const markerIcon = useMemo(() => {
    const string = renderToString(<HomeIcon />);
    return window.L.icon({
      iconUrl: encodeURI(`data:image/svg+xml, ${string}`).replace('#', '%23'),
      iconSize: [38, 95],
    });
  }, []);

  const positions = useMemo(() => locations.map(({ code, latitude, longitude }) => ({
    code,
    position: [latitude, longitude],
  })), [locations]);

  const onMarkerClick = useCallback((event, code) => {
    console.warn('MarkerClick', event, code);
  });

  return (
    <div className={container}>
      <Map center={positions[0].position} zoom={13} className={container}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { positions.map(({ position, code }) => (
          <Marker
            key={code}
            icon={markerIcon}
            position={position}
            onclick={(e) => { onMarkerClick(e, code); }}
          />
        ))}
      </Map>

    </div>

  );
};

export default StoreLocationFinderMap;
