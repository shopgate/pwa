import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { MORE_PATH } from 'Pages/More/constants';
import MoreIcon from '@shopgate/pwa-ui-shared/icons/MoreIcon';
import * as portals from '../../constants';
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * The tab bar home action.
 */
class TabBarMoreAction extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    if (this.props.path === MORE_PATH) {
      return;
    }

    const link = new ParsedLink(MORE_PATH);
    link.open();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal name={portals.TAB_BAR_MORE_BEFORE} props={this.props} />
        <Portal
          name={portals.TAB_BAR_MORE}
          props={{
            ...this.props,
            TabBarAction,
          }}
        >
          <TabBarAction
            {...this.props}
            icon={(
              <Portal name={portals.TAB_BAR_MORE_ICON}>
                <MoreIcon className={styles} />
              </Portal>
            )}
            onClick={this.handleClick}
          />
        </Portal>
        <Portal name={portals.TAB_BAR_MORE_AFTER} props={this.props} />
      </Fragment>
    );
  }
}

export default TabBarMoreAction;
