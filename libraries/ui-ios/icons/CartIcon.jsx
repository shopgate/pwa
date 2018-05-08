import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `
  <path
    fill="currentColor"
    d="M26.5,1.98,25.6,6.309H20.7L21.817,1ZM21.413,23.509A1.491,1.491,0,1,0,22.9,22.017a1.491,1.491,0,0,0-1.491,1.491Zm-5.505,0A1.491,1.491,0,1,0,17.4,22.017a1.491,1.491,0,0,0-1.491,1.491ZM19.322,3.167l-3.713.771L16.1,6.3h2.567ZM12.906,5a1.134,1.134,0,0,0-1.053-.735H9.379a1.129,1.129,0,1,0,0,2.258h1.695l3.468,9.027a1.134,1.134,0,0,0,1.053.735h7.837a1.095,1.095,0,1,1,0,2.189H14.987a1.129,1.129,0,1,0,0,2.258h8.451a3.348,3.348,0,0,0,2.339-5.748l2.777-5.008a1.129,1.129,0,0,0-.438-1.536,1.085,1.085,0,0,0-.38-.127H14.174Z"
    transform="translate(-10628.25 6657)"
  />
`;

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const CartIcon = props => <Icon content={content} viewBox="-10620 6658 20.447 24" {...props} />;

export default CartIcon;
