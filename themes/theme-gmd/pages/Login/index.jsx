import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import {
  LOGIN_PATH,
  REGISTER_PATH,
  CHECKOUT_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import {
  View, TextLink, I18n, RippleButton, TextField, Portal,
  PersonIcon, LockIcon, VisibilityIcon, VisibilityOffIcon,
} from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { validate, i18n } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
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
import connect from './connector';
import ForgotPassword from './components/ForgotPassword';

const defaultFormState = {
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

const useStyles = makeStyles()(theme => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
  headline: {
    fontSize: '2.1875rem',
    lineHeight: 1,
    fontWeight: 500,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontSize: '2rem',
      fontWeight: 'normal',
      paddingBottom: theme.spacing(2),
    },
  },
  subline: {
    fontSize: '1.125rem',
    color: 'var(--color-text-medium-emphasis)',
    marginBottom: theme.spacing(2),
    marginTop: 4,
  },
  form: {
    paddingTop: theme.spacing(3),
    '--form-element-left-offset': '30px',
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      ...StylePresets.OUTLINED_FORM_FIELDS,
      ' .simpleInput': {
        paddingLeft: theme.spacing(2),
      },
    },
  },
  input: {
    width: '100%',
    ' .label': {
      color: 'var(--color-text-medium-emphasis)',
    },
    ' .simpleInput': {
      color: 'var(--color-text-high-emphasis)',
    },
  },
  forgotWrapper: {
    textAlign: 'right',
    fontSize: '0.75rem',
    marginTop: -theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonWrapper: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(3),
  },
  button: {
    width: '100%',
  },
  noAccount: {
    marginRight: theme.spacing(0.5),
  },
  signup: {
    display: 'inline-block',
    color: 'var(--color-primary) !important',
    width: 'auto',
    margin: '-.35em 0 -.35em -.35em',
    padding: '.35em',
  },
  icon: {
    fill: 'var(--color-text-medium-emphasis)',
    width: '24px',
    height: '24px',
  },
  iconLeft: {
    marginRight: theme.spacing(0.5),
  },
  iconRight: {
    marginLeft: theme.spacing(0.5),
  },
  toggleButton: {
    padding: '4px',
    margin: '-4px 0',
  },
}));

/**
 * GMD login view.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Login = ({
  login: loginAction,
  visible,
  isDisabled,
  isLoading,
  redirect,
  validate: validateProp,
}) => {
  const { classes, cx } = useStyles();
  const [state, setState] = useState(defaultFormState);
  const userFieldRef = useRef(null);
  const passwordFieldRef = useRef(null);
  const prevVisibleRef = useRef(visible);

  useEffect(() => {
    if (prevVisibleRef.current && !visible) {
      setState(defaultFormState);
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  const setUserFieldRef = useCallback((input) => {
    userFieldRef.current = input;
  }, []);

  const setPasswordFieldRef = useCallback((input) => {
    passwordFieldRef.current = input;
  }, []);

  const handleEmailChange = useCallback((loginVal) => {
    setState((prev) => {
      const { valid } = validate({ login: loginVal }, loginConstraints);
      return {
        ...prev,
        login: loginVal,
        loginError: !valid ? 'validation.email' : '',
      };
    });
  }, []);

  const handlePasswordChange = useCallback((passwordVal) => {
    setState((prev) => {
      const { valid } = validate({ password: passwordVal }, passwordConstraints);
      return {
        ...prev,
        password: passwordVal,
        passwordError: !valid ? 'validation.checkField' : '',
      };
    });
  }, []);

  const handleSubmitForm = useCallback((event) => {
    event.preventDefault();
    userFieldRef.current?.blur();
    passwordFieldRef.current?.blur();

    if (validateProp && (state.loginError || state.passwordError)) {
      setState(prev => ({
        ...prev,
        showErrors: true,
      }));
      return;
    }

    loginAction(state, redirect || {});
  }, [validateProp, state, loginAction, redirect]);

  const togglePasswordVisibility = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPasswordVisible: !prev.isPasswordVisible,
    }));
  }, []);

  const handlePasswordToggleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePasswordVisibility();
    }
  }, [togglePasswordVisibility]);

  const {
    login, showErrors, loginError, password, passwordError, isPasswordVisible,
  } = state;

  const hasLoginError = showErrors && loginError.length > 0;
  const hasPasswordError = showErrors && passwordError.length > 0;
  const VisibilityToggleIcon = isPasswordVisible ? VisibilityOffIcon : VisibilityIcon;
  const isCheckout = redirect?.location === CHECKOUT_PATH;

  return (
    <View>
      <CloseBar shadow={false} />
      <section className={classes.container} data-test-id="LoginPage">
        <Portal name={PAGE_LOGIN_BEFORE} />
        <Portal name={PAGE_LOGIN}>
          <div className={cx(classes.headline, 'theme__headline')}>
            <I18n.Text string="login.headline" />
          </div>
          <div className={cx(classes.subline, 'theme__sub-headline')}>
            <I18n.Text string="login.subline" />
          </div>
          <Portal name={PAGE_LOGIN_FORM_BEFORE} />
          <Portal name={PAGE_LOGIN_FORM}>
            <form onSubmit={handleSubmitForm} noValidate className={classes.form}>
              <TextField
                required
                type="email"
                name="email"
                className={classes.input}
                label="login.email"
                onChange={handleEmailChange}
                value={login}
                setRef={setUserFieldRef}
                errorText={showErrors ? loginError : ''}
                attributes={{
                  'aria-invalid': hasLoginError,
                  'aria-describedby': hasLoginError ? 'ariaError-email' : null,
                }}
                leftElement={<PersonIcon className={cx(classes.icon, classes.iconLeft)} />}
              />
              <TextField
                required
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                className={classes.input}
                label="login.password"
                onChange={handlePasswordChange}
                value={password}
                setRef={setPasswordFieldRef}
                errorText={showErrors ? passwordError : ''}
                attributes={{
                  'aria-invalid': hasPasswordError,
                  'aria-describedby': hasPasswordError ? 'ariaError-password' : null,
                }}
                leftElement={<LockIcon className={cx(classes.icon, classes.iconLeft)} />}
                rightElement={(
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={togglePasswordVisibility}
                    onKeyDown={handlePasswordToggleKeyDown}
                    aria-label={isPasswordVisible
                      ? i18n.text('login.hide_password')
                      : i18n.text('login.show_password')}
                    className={classes.toggleButton}
                  >
                    <VisibilityToggleIcon className={cx(classes.icon, classes.iconRight)} />
                  </div>
                )}
              />
              <div className={classes.forgotWrapper}>
                <ForgotPassword />
              </div>
              <div className={classes.buttonWrapper} data-test-id="LoginButton">
                <RippleButton
                  className={classes.button}
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
              <I18n.Text string="login.no_account" className={classes.noAccount} />
              <TextLink
                href={`${REGISTER_PATH}${isCheckout ? '?checkout=1' : ''}`}
                className={classes.signup}
                disabled={isLoading || isDisabled}
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
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  redirect: PropTypes.shape(),
  validate: PropTypes.bool,
};

Login.defaultProps = {
  isDisabled: false,
  isLoading: false,
  redirect: {},
  validate: true,
};

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
