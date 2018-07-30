import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import * as portals from '../../constants';
import FavoritesIconBadge from './components/FavoritesIconBadge'; // eslint-disable-line import/no-named-as-default
import TabBarAction from '../TabBarAction';
import styles from './style';

/**
 * The tab bar favorites action.
 */
class TabBarFavoritesAction extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    ...TabBarAction.propTypes,
  };

  static defaultProps = TabBarAction.defaultProps;

  /**
   * Handles the click action.
   */
  handleClick = () => {
    if (this.props.path === FAVORITES_PATH) {
      return;
    }

    const link = new ParsedLink(FAVORITES_PATH);
    link.open();
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Portal
          name={portals.TAB_BAR_FAVORITES_BEFORE}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
        <Portal
          name={portals.TAB_BAR_FAVORITES}
          props={{
            ...this.props,
            TabBarAction,
          }}
        >
          <TabBarAction
            {...this.props}
            icon={(
              <Portal name={portals.TAB_BAR_FAVORITES_ICON}>
                <FavoritesIcon className={styles} />
              </Portal>
            )}
            onClick={this.handleClick}
          >
            <FavoritesIconBadge />
          </TabBarAction>
        </Portal>
        <Portal
          name={portals.TAB_BAR_FAVORITES_AFTER}
          props={{
            ...this.props,
            TabBarAction,
          }}
        />
      </Fragment>
    );
  }
}

export default TabBarFavoritesAction;
