import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import Portal from '@shopgate/pwa-common/components/Portal';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import { i18n } from '@shopgate/engage/core';
import * as portals from '../../constants';
import FavoritesIconBadge from './components/FavoritesIconBadge'; // eslint-disable-line import/no-named-as-default
import TabBarAction from '../TabBarAction';
import connect from '../connector';
import connectBadge from './components/FavoritesIconBadge/connector';
import styles from './style';

/**
 * The tab bar favorites action.
 */
class TabBarFavoritesAction extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    showWishlistItemsCountBadge: PropTypes.bool.isRequired,
    widgetSettings: PropTypes.shape({
      showCounter: PropTypes.bool,
    }),
    ...TabBarAction.propTypes,
  };

  static defaultProps = {
    widgetSettings: {
      showCounter: true,
    },
    ...TabBarAction.defaultProps,
  };

  /**
   * Handles the click action.
   */
  handleClick = () => {
    this.props.historyPush({ pathname: FAVORITES_PATH });
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const showCounter =
    (hasNewServices() && this.props.showWishlistItemsCountBadge) ||
    (!hasNewServices() &&
      (this.props.widgetSettings.showCounter ??
        TabBarFavoritesAction.defaultProps.widgetSettings.showCounter));

    const { label, favoritesCount } = this.props;
    const ariaCount = showCounter ? `${i18n.text('common.products')}: ${favoritesCount}.` : '';
    const ariaLabel = `${i18n.text(label)}. ${ariaCount} `;
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
            aria-label={ariaLabel}
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

export default withWidgetSettings(connect(connectBadge(TabBarFavoritesAction)), '@shopgate/theme-ios11/components/TabBar/FavoritesIconBadge');
