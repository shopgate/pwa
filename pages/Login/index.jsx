/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import View from 'Components/View';
import RippleButton from 'Components/RippleButton';
import TextField from 'Components/TextField';
import connect from './connector';
import ForgotPassword from './components/ForgotPassword';
import styles from './style';

/**
 * The login view component.
 */
class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
  };
  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.userField = null;
    this.passwordField = null;

    this.state = {
      login: '',
      password: '',
    };
  }

  /**
   * Stores the reference to the username input field.
   * @param {Object} input The input field reference.
   */
  setUserFieldRef = (input) => {
    this.userField = input;
  };

  /**
   * Stores the reference to the password input field.
   * @param {Object} input The input field reference.
   */
  setPasswordFieldRef = (input) => {
    this.passwordField = input;
  };

  /**
   * Handles change of the email input field.
   * @param {string} login The login username.
   */
  handleEmailChange = (login) => {
    this.setState({ login });
  };

  /**
   * Handles change of the password input field.
   * @param {string} password The login password.
   */
  handlePasswordChange = (password) => {
    this.setState({ password });
  };

  /**
   * Handles submitting the login form.
   * @param {Object} event The event object.
   */
  handleSubmitForm = (event) => {
    event.preventDefault();

    // Blur all the fields.
    this.userField.blur();
    this.passwordField.blur();
    // Submit the form data.
    this.props.login(this.state);
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <View>
        <section className={styles.container} data-test-id="LoginPage">
          <div className={styles.headline}>
            <I18n.Text string="login.headline" />
          </div>
          <div className={styles.subline}>
            <I18n.Text string="login.subline" />
          </div>
          <form onSubmit={this.handleSubmitForm}>
            <TextField
              type="email"
              name="email"
              className={styles.input}
              label="login.email"
              onChange={this.handleEmailChange}
              value={this.state.login}
              setRef={this.setUserFieldRef}
            />
            <TextField
              password
              name="password"
              className={styles.input}
              label="login.password"
              onChange={this.handlePasswordChange}
              value={this.state.password}
              setRef={this.setPasswordFieldRef}
            />
            <div className={styles.forgotWrapper}>
              <ForgotPassword />
            </div>
            <div className={styles.buttonWrapper} data-test-id="LoginButton">
              <RippleButton className={styles.button} type="secondary" disabled={this.props.isLoading}>
                <I18n.Text string="login.button" />
              </RippleButton>
            </div>
          </form>
          <div>
            <I18n.Text string="login.no_account" className={styles.noAccount} />
            <Link href="/register" className={styles.signup}>
              <I18n.Text string="login.register" />
            </Link>
          </div>
        </section>
      </View>
    );
  }
}

export default connect(Login);
