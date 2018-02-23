/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Button from 'Components/Button';
import Headline from 'Components/Headline';
import List from 'Components/List';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';

import styles from './style';

/**
 * The More component.
 */
class UserMenu extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    user: null,
  };

  /**
   * Renders the logged-in state.
   * @param {Object} user The user object.
   * @returns {JSX}
   */
  renderLoggedIn(user) {
    return (
      <div>
        <Headline>
          <I18n.Text string="navigation.welcome_message" params={{ name: user.firstName }} />
        </Headline>
        <List>
          <List.Item title="navigation.logout" onClick={this.props.logout} />
        </List>
      </div>
    );
  }

  /**
   * Renders the logged-out state.
   * @returns {JSX}
   */
  renderLoggedOut() { // eslint-disable-line  class-methods-use-this
    return (
      <div>
        <Headline>
          <I18n.Text string="navigation.your_account" />
        </Headline>
        <Grid className={styles.grid}>
          <Grid.Item className={styles.gridItem}>
            <Button className={styles.button}>
              <Link href={LOGIN_PATH}>
                <I18n.Text string="login.button" />
              </Link>
            </Button>
          </Grid.Item>
          <Grid.Item className={styles.gridItem}>
            <Button className={styles.button}>
              <Link href={REGISTER_PATH}>
                {/* Proper registration link will be handled later. */}
                <I18n.Text string="login.signup" />
              </Link>
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (this.props.isLoggedIn) {
      return this.renderLoggedIn(this.props.user);
    }

    return this.renderLoggedOut();
  }
}

export default UserMenu;
