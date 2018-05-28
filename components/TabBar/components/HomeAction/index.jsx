import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * The tab bar home action.
 */
class TabBarHomeAction extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    if (this.props.path === INDEX_PATH) {
      return;
    }

    const link = new ParsedLink(INDEX_PATH);
    link.open();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal
          name={portals.TAB_BAR_HOME_BEFORE}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
        <Portal
          name={portals.TAB_BAR_HOME}
          props={{
            ...this.props,
            TabBarAction,
          }}
        >
          <TabBarAction
            {...this.props}
            icon={(
              <Portal name={portals.TAB_BAR_HOME_ICON}>
                <HomeIcon className={styles} />
              </Portal>
            )}
            onClick={this.handleClick}
          />
        </Portal>
        <Portal
          name={portals.TAB_BAR_HOME_AFTER}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
      </Fragment>
    );
  }
}

export default TabBarHomeAction;
