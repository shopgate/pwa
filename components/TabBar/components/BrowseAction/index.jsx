import React from 'react';
import BrowseIcon from 'Components/icons/BrowseIcon';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(BROWSE_PATH);
  link.open();
};

/**
 * Renders the tab bar browse action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarBrowseAction = props => (
  <TabBarAction
    {...props}
    icon={<BrowseIcon className={styles} />}
    onClick={handleClick}
  />
);

TabBarBrowseAction.propTypes = TabBarAction.propTypes;
TabBarBrowseAction.defaultProps = TabBarAction.defaultProps;

export default TabBarBrowseAction;
