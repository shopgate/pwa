import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `
  <path
    fill="currentColor"
    d="M16799.3,14716.7l-5.8-5.9a8.438,8.438,0,0,1-4.9,1.6,8.7,8.7,0,1,1,8.6-8.7,8.814,8.814,0,0,1-2.2,5.8l5.705,5.8a.966.966,0,0,1,0,1.4.906.906,0,0,1-.705.3A1.054,1.054,0,0,1,16799.3,14716.7Zm-17.3-13a6.748,6.748,0,0,0,6.6,6.7,6.7,6.7,0,1,0-6.6-6.7Zm20,2.3a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Zm-1-4a1,1,0,1,1,0-2h9a1,1,0,1,1,0,2Zm-1-4a1,1,0,0,1,0-2h10a1,1,0,0,1,0,2Z"
    transform="translate(-27500 -8035.002)"
  />
`;

/**
 * The home icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Browse = props => <Icon content={content} {...props} viewBox="-10720 6659.999 31.002 21.998" />;

export default Browse;
