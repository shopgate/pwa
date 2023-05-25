import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const fallback = '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>';

/**
 * The trash outline icon component.
 * @link https://fonts.google.com/icons?selected=Material+Icons:delete_outline:&icon.query=trash
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const TrashOutline = props => <Icon
  content={themeConfig.icons.trashOutline || fallback}
  {...props}
/>;

export default TrashOutline;
