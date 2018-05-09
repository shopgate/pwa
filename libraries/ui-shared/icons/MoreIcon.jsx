import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `
<path
  fill="currentColor"
  d="M16343.128,14719.063a3.25,3.25,0,1,1,3.25,3.25A3.249,3.249,0,0,1,16343.128,14719.063Zm-10,0a3.252,3.252,0,1,1,3.25,3.25A3.253,3.253,0,0,1,16333.124,14719.063Zm-10,0a3.25,3.25,0,1,1,3.249,3.25A3.252,3.252,0,0,1,16323.125,14719.063Z"
  transform="translate(-26852 -8048.063)"
/>
`;

/**
 * The cart icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const More = props => <Icon viewBox="-10528.875 6667.75 26.502 6.5" content={content} {...props} />;

export default More;
