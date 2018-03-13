import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import BrowseIcon from 'Components/icons/BrowseIcon';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * The tab bar browse action.
 */
class TabBarBrowseAction extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    if (this.props.path === BROWSE_PATH) {
      return;
    }

    const link = new ParsedLink(BROWSE_PATH);
    link.open();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <TabBarAction
        {...this.props}
        icon={(
          <Portal name="tabbar.browse-icon">
            <BrowseIcon className={styles} />
          </Portal>
        )}
        onClick={this.handleClick}
      />
    );
  }
}

export default TabBarBrowseAction;
