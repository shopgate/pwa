import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

// SVG Content
const content = `
<g>
  <defs>
    <filter id="map-marker-shadow" width="1000%" height="1000%" x="-500%" y="-500%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="0.7 0.7"/>
    </filter>
  </defs>
  <circle class="contrast "cx="11.981" cy="8.986" r="3.091" fill="#fff"/>
  <ellipse cx="12.148" cy="21.898" filter="url(#map-marker-shadow)" opacity=".34" rx="3.254" ry=".5" transform="rotate(.314 -142.825 -86.031) skewX(1.175)"/>
  <path  d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 10a3 3 0 110-6 3 3 0 010 6z" paint-order="stroke"/>
</g>`;

/**
 * The location icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const MapMarkerIcon = props => <Icon content={themeConfig.icons.mapMarker || content} {...props} />;

export default MapMarkerIcon;
