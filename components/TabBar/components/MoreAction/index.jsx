import React from 'react';
import MoreIcon from 'Components/icons/MoreIcon';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { MORE_PATH } from 'Pages/More/constants';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * Opens the link on click on the action.
 */
const handleClick = () => {
  const link = new ParsedLink(MORE_PATH);
  link.open();
};

/**
 * Renders the tab bar more action component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const TabBarMoreAction = props => (
  <TabBarAction
    {...props}
    icon={<MoreIcon className={styles} />}
    onClick={handleClick}
  />
);

TabBarMoreAction.propTypes = TabBarAction.propTypes;
TabBarMoreAction.defaultProps = TabBarAction.defaultProps;

export default TabBarMoreAction;
