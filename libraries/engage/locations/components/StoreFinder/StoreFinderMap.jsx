import React, { useContext, useMemo, useCallback } from 'react';
import Color from 'color';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import { getCSSCustomProp } from '@shopgate/engage/styles/helpers/cssCustomProperties';
import LocationFilledIcon from '@shopgate/pwa-ui-shared/icons/LocationFilledIcon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { StoreFinderContext } from '../../locations.context';
import { container } from './StoreFinderMap.style';

const { colors } = themeConfig;

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

  /**
   * Creates a marker icon
   * @param {string} [color=null] An optional color
   * @returns {string}
   */
  const createIcon = (color = null) => {
    const string = renderToString(<LocationFilledIcon color={color} />);
    return window.L.icon({
      iconUrl: encodeURI(`data:image/svg+xml, ${string}`).replace('#', '%23'),
      iconSize: [38, 38],
    });
  };

  const icon = useMemo(() => {
    const color = Color(getCSSCustomProp('--color-text-medium-emphasis') || colors.shade9);
    return createIcon(color.rgb().string());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  const iconSelected = useMemo(() => {
    const color = Color(getCSSCustomProp('--color-primary') || colors.primary);
    return createIcon(color.rgb().string());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

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
      <Map center={viewport} zoom={13} className={container}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { positions.map(({ position, code, location }) => (
          <Marker
            key={code}
            icon={selectedLocation.code === code ? iconSelected : icon}
            position={position}
            onclick={(e) => { onMarkerClick(e, location); }}
          />
        ))}
      </Map>

    </div>

  );
};

export default StoreFinderMap;
