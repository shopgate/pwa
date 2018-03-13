import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import Portal from '@shopgate/pwa-common/components/Portal';
import {FAVORITES_PATH} from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from 'Components/icons/HeartIcon';
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
          <Portal name="tabbar.heart-icon">
            <FavoritesIcon className={styles} />
          </Portal>
        )}
        onClick={this.handleClick}
      >
        <FavoritesIconBadge />
      </TabBarAction>
    );
  }
}

export default TabBarFavoritesAction;
