import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

const content = `
    <g>
      <path d="M15.3,6.9c-0.5,0-0.9,0.4-0.9,0.9s0.4,0.9,0.9,0.9h2.1v10.8H6.6V8.7h2.1c0.5,0,0.9-0.4,0.9-0.9S9.2,6.9,8.7,6.9H4.8v14.4 h14.4V6.9H15.3z"/>
      <path d="M9.9,5.8l1.4-1.4v8.9c0,0.4,0.4,0.8,0.8,0.8c0.4,0,0.8-0.4,0.8-0.8V4.5l1.4,1.4c0.2,0.2,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2 c0.3-0.3,0.3-0.8,0-1.1L12,1.5L8.7,4.7C8.4,5,8.4,5.5,8.7,5.8C9,6.1,9.5,6.1,9.9,5.8z"/>
  </g>
  `;

/**
 * The Share icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShareIcon = props => <Icon content={content} {...props} />;

export default ShareIcon;
