import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import connect from '../connector';
import styles from './style';

/**
 * The TabBarHomeAction component.
 */
class TabBarHomeAction extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  handleClick = () => {
    this.props.navigate({ pathname: INDEX_PATH });
  };

  /**
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

export default connect(TabBarHomeAction);
