import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  LOGIN_PATH,
  REGISTER_PATH,
  CHECKOUT_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { View, TextLink } from '@shopgate/engage/components';
import { validate } from '@shopgate/engage/core';
import { RouteContext } from '@shopgate/pwa-common/context';
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
import { CloseBar } from 'Components/AppBar/presets';
import connect from './connector';
import ForgotPassword from './components/ForgotPassword';
import styles from './style';

const defaultState = {
  login: '',
  password: '',
  loginError: '',
  passwordError: '',
  showErrors: false,
};

const loginConstraints = {
  login: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    email: {
      message: 'validation.email',
    },
  },
};

const passwordConstraints = {
  password: {
    presence: {
      message: 'validation.required',
      allowEmpty: false,
    },
    length: {
      minimum: 3,
    },
  },
};

/**
 * The login view component.
 */
class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    redirect: PropTypes.shape(),
    validate: PropTypes.bool,
  };

  static defaultProps = {
    isDisabled: false,
    isLoading: false,
    redirect: {},
    validate: true,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.userField = null;
    this.passwordField = null;

    this.state = defaultState;
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    /**
     * Reset the form values when the page is not visible to the user.
     */
    if (this.props.visible && !nextProps.visible) {
      this.setState(defaultState);
    }
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
    this.setState(() => {
      const { valid } = validate({ login }, loginConstraints);

      return {
        login,
        loginError: !valid ? 'validation.email' : '',
      };
    });
  };

  /**
   * Handles change of the password input field.
   * @param {string} password The login password.
   */
  handlePasswordChange = (password) => {
    this.setState(() => {
      const { valid } = validate({ password }, passwordConstraints);

      return {
        password,
        passwordError: !valid ? 'validation.checkField' : '',
      };
    });
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

    if (this.props.validate && (this.state.loginError || this.state.passwordError)) {
      // Start showing errors after first submit when configured
      this.setState({ showErrors: true });
      return;
    }

    const { redirect = {} } = this.props;
    this.props.login(this.state, redirect);
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const isCheckout = this.props.redirect?.location === CHECKOUT_PATH;

    return (
      <View aria-hidden={false}>
        <CloseBar shadow={false} />
        <section className={styles.container} data-test-id="LoginPage">
          <Portal name={PAGE_LOGIN_BEFORE} />
          <Portal name={PAGE_LOGIN}>
            <div className={styles.headline}>
              <I18n.Text string="login.headline" />
            </div>
            <div className={styles.subline}>
              <I18n.Text string="login.subline" />
            </div>
            <Portal name={PAGE_LOGIN_FORM_BEFORE} />
            <Portal name={PAGE_LOGIN_FORM}>
              { /* No validate, browsers reject IDN emails! */}
              <form onSubmit={this.handleSubmitForm} noValidate className={styles.form}>
                <TextField
                  type="email"
                  name="email"
                  className={styles.input}
                  label="login.email"
                  onChange={this.handleEmailChange}
                  value={this.state.login}
                  setRef={this.setUserFieldRef}
                  errorText={this.state.showErrors ? this.state.loginError : ''}
                />
                <TextField
                  password
                  name="password"
                  className={styles.input}
                  label="login.password"
                  onChange={this.handlePasswordChange}
                  value={this.state.password}
                  setRef={this.setPasswordFieldRef}
                  errorText={this.state.showErrors ? this.state.passwordError : ''}
                />
                <div className={styles.forgotWrapper}>
                  <ForgotPassword />
                </div>
                <div className={styles.buttonWrapper} data-test-id="LoginButton">
                  <RippleButton
                    className={styles.button}
                    type="secondary"
                    disabled={this.props.isLoading || this.props.isDisabled}
                  >
                    <I18n.Text string="login.button" />
                  </RippleButton>
                </div>
              </form>
            </Portal>
            <Portal name={PAGE_LOGIN_FORM_AFTER} />
            <div>
              <Portal name={PAGE_LOGIN_REGISTER_LINK_BEFORE} />
              <Portal name={PAGE_LOGIN_REGISTER_LINK}>
                <I18n.Text string="login.no_account" className={styles.noAccount} />
                <TextLink
                  href={`${REGISTER_PATH}${isCheckout ? '?checkout=1' : ''}`}
                  className={styles.signup}
                  disabled={this.props.isLoading || this.props.isDisabled}
                >
                  <I18n.Text string="login.register" />
                </TextLink>
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

export default connect(props => (
  <RouteContext.Consumer>
    {({ state, visible }) => (
      <LoadingContext.Consumer>
        {({ isLoading }) => (
          <Login
            {...props}
            isLoading={isLoading(LOGIN_PATH)}
            redirect={state.redirect}
            visible={visible}
          />
        )}
      </LoadingContext.Consumer>
    )}
  </RouteContext.Consumer>
));
