import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `
  <path
    fill="currentColor"
    d="M63.6,27.6V10.4a1.028,1.028,0,0,0-1.1-1H49.4a1.1,1.1,0,0,0-1.1,1V27.6a1.028,1.028,0,0,0,1.1,1H62.5A1.028,1.028,0,0,0,63.6,27.6ZM62.6,8A2.433,2.433,0,0,1,65,10.4V27.6A2.433,2.433,0,0,1,62.6,30H49.4A2.433,2.433,0,0,1,47,27.6V10.4A2.433,2.433,0,0,1,49.4,8ZM49.8,27H62.3V14.7H49.8Zm.7-14.6H56A.7.7,0,1,0,56,11H50.5a.7.7,0,1,0,0,1.4Z"
    transform="translate(-3112 1705)"
  />
`;

/**
 * The home icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Home = props => <Icon content={content} viewBox="-3065 1713 18 22" {...props} />;

export default Home;
