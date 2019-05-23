import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import BrowseIcon from '@shopgate/pwa-ui-shared/icons/BrowseIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import connect from '../connector';
import styles from './style';

/**
 * The tab bar browse action.
 */
class TabBarBrowseAction extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    this.props.historyPush({ pathname: BROWSE_PATH });
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal
          name={portals.TAB_BAR_BROWSE_BEFORE}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
        <Portal
          name={portals.TAB_BAR_BROWSE}
          props={{
            ...this.props,
            TabBarAction,
          }}
        >
          <TabBarAction
            {...this.props}
            icon={(
              <Portal name={portals.TAB_BAR_BROWSE_ICON}>
                <BrowseIcon className={styles} />
              </Portal>
            )}
            onClick={this.handleClick}
          />
        </Portal>
        <Portal
          name={portals.TAB_BAR_BROWSE_AFTER}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
      </Fragment>
    );
  }
}

export default connect(TabBarBrowseAction);
