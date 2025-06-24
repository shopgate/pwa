import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  LOGIN_PATH,
  REGISTER_PATH,
  CHECKOUT_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import {
  View, I18n, Link, Portal, TextField, RippleButton,
} from '@shopgate/engage/components';
import { validate, i18n } from '@shopgate/engage/core';
import { RouteContext } from '@shopgate/pwa-common/context';
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
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Icon from '@shopgate/pwa-common/components/Icon';
import classNames from 'classnames';
import connect from './connector';
import ForgotPassword from './components/ForgotPassword';
import styles from './style';

const defaultState = {
  login: '',
  password: '',
  loginError: '',
  passwordError: '',
  showErrors: false,
  isPasswordVisible: false,
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
   * Toggles the visibility of the password input field.
   */
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  /**
   * Handles keyboard interaction for toggling password visibility.
   * @param {KeyboardEvent} e The keyboard event.
   */
  handlePasswordToggleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.togglePasswordVisibility();
    }
  };

  /**
   * Renders the component.
   * @return {JSX.Element}
   */
  render() {
    const isCheckout = this.props.redirect?.location === CHECKOUT_PATH;
    const { isLoading, isDisabled } = this.props;
    const {
      login, showErrors, loginError, password, passwordError,
    } = this.state;

    const hasLoginError = showErrors && loginError.length > 0;
    const hasPasswordError = showErrors && passwordError.length > 0;

    const {
      person, lock, visibility, visibilityOff,
    } = themeConfig.icons || {};
    const isToggleVisible = visibility && visibilityOff;
    const iconVisibility = this.state.isPasswordVisible ? visibilityOff : visibility;

    return (
      <View>
        <CloseBar shadow={false} />
        <section className={styles.container} data-test-id="LoginPage">
          <Portal name={PAGE_LOGIN_BEFORE} />
          <Portal name={PAGE_LOGIN}>
            <div className={classNames(styles.headline, 'theme__headline')}>
              <I18n.Text string="login.headline" />
            </div>
            <div className={classNames(styles.subline, 'theme__sub-headline')}>
              <I18n.Text string="login.subline" />
            </div>
            <Portal name={PAGE_LOGIN_FORM_BEFORE} />
            <Portal name={PAGE_LOGIN_FORM}>
              { /* No validate, browsers reject IDN emails! */}
              <form onSubmit={this.handleSubmitForm} noValidate className={styles.form}>
                <TextField
                  required
                  type="email"
                  name="email"
                  className={styles.input}
                  label="login.email"
                  onChange={this.handleEmailChange}
                  value={login}
                  setRef={this.setUserFieldRef}
                  errorText={showErrors ? loginError : ''}
                  attributes={{
                    'aria-invalid': hasLoginError,
                    'aria-describedby': hasLoginError ? 'ariaError-email' : null,
                  }}
                  leftElement={person ? <Icon content={person} className={styles.icon} /> : null}
                />
                <TextField
                  required
                  type={this.state.isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  className={styles.input}
                  label="login.password"
                  onChange={this.handlePasswordChange}
                  value={password}
                  setRef={this.setPasswordFieldRef}
                  errorText={showErrors ? passwordError : ''}
                  attributes={{
                    'aria-invalid': hasPasswordError,
                    'aria-describedby': hasPasswordError ? 'ariaError-password' : null,
                  }}
                  leftElement={lock ? <Icon content={lock} className={styles.icon} /> : null}
                  rightElement={isToggleVisible ? (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={this.togglePasswordVisibility}
                      onKeyDown={this.handlePasswordToggleKeyDown}
                      aria-label={this.state.isPasswordVisible
                        ? i18n.text('login.hide_password')
                        : i18n.text('login.show_password')
                      }
                    >
                      <Icon content={iconVisibility} className={styles.icon} />
                    </div>
                  ) : null}
                />
                <div className={styles.forgotWrapper}>
                  <ForgotPassword />
                </div>
                <div className={styles.buttonWrapper} data-test-id="LoginButton">
                  <RippleButton
                    className={styles.button}
                    type="secondary"
                    disabled={isLoading || isDisabled}
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
                <Link
                  href={`${REGISTER_PATH}${isCheckout ? '?checkout=1' : ''}`}
                  className={styles.signup}
                  disabled={isLoading || isDisabled}
                >
                  <I18n.Text string="login.signup" />
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
