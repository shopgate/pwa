import React from 'react';
import Link from '@shopgate/pwa-common/components/Link';
import { link } from './TextLink.style';

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const TextLink = props => (
  <Link {...props} className={link} tag="a" />
);

export default TextLink;
