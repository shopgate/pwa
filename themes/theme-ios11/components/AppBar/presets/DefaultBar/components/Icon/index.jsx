import React from 'react';
import { AppBarIOS as AppBar } from '@shopgate/engage/components';

/**
 * An icon button of the header. It takes the icon color of the header from the theme.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarIcon = props => <AppBar.Icon {...props} />;

export default AppBarIcon;
