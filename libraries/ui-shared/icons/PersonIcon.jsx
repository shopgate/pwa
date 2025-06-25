import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const fallback = '<path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>';

/**
 * The Person icon component
 *
 * @link https://fonts.google.com/icons?selected=Material+Icons:person
 *
 * @param {Object} props - Icon component props.
 * @returns {JSX.Element}
 */
const PersonIcon = props => <Icon
  content={themeConfig.icons.person || fallback}
  {...props}
/>;

export default PersonIcon;
