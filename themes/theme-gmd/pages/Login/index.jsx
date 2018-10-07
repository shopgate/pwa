import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import View from 'Components/View';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PAGE_LOGIN_BEFORE,
  PAGE_LOGIN,
  PAGE_LOGIN_AFTER,
  PAGE_LOGIN_REGISTER_LINK_BEFORE,
  PAGE_LOGIN_REGISTER_LINK,
  PAGE_LOGIN_REGISTER_LINK_AFTER,
  PAGE_LOGIN_FORM_BEFORE,
  PAGE_LOGIN_FORM,
  PAGE_LOGIN_FORM_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
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
          <Portal name={PAGE_LOGIN_BEFORE} />
          <Portal name={PAGE_LOGIN} >
            <div className={styles.headline}>
              <I18n.Text string="login.headline" />
            </div>
            <div className={styles.subline}>
              <I18n.Text string="login.subline" />
            </div>
            <Portal name={PAGE_LOGIN_FORM_BEFORE}>
              <div className={styles.padLine} />
            </Portal>
            <Portal name={PAGE_LOGIN_FORM}>
              { /* No validate, browsers reject IDN emails! */ }
              <form onSubmit={this.handleSubmitForm} noValidate>
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
            </Portal>
            <Portal name={PAGE_LOGIN_FORM_AFTER} />
            <div>
              <Portal name={PAGE_LOGIN_REGISTER_LINK_BEFORE} />
              <Portal name={PAGE_LOGIN_REGISTER_LINK} >
                <I18n.Text string="login.no_account" className={styles.noAccount} />
                <Link href="/register" className={styles.signup}>
                  <I18n.Text string="login.register" />
                </Link>
              </Portal>
              <Portal name={PAGE_LOGIN_REGISTER_LINK_AFTER} />
            </div>
          </Portal>
          <Portal name={PAGE_LOGIN_AFTER} />
        </section>
      </View>
    );
  }
}

export default connect(Login);
