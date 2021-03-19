import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

// SVG Content
const content = `
<g fill="none" fill-rule="evenodd" transform="translate(0,4.5)">
  <path d="M-1-4h24v24H-1z"/>
  <path d="M18.5 4H16V2c0-1.1-.9-2-2-2H2C.9 0 0 .9 0 2v9c0 1.1.9 2 2 2 0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h1c.55 0 1-.45 1-1V8.67c0-.43-.14-.85-.4-1.2L19.3 4.4c-.19-.25-.49-.4-.8-.4zM5 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5L20.46 8H16V5.5h2.5zM17 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="currentColor" />
/g>`;

/**
 * The shipping method icon component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ShippingMethodIcon = props =>
  <Icon content={themeConfig.icons.shippingMethod || content} {...props} />;

export default ShippingMethodIcon;
