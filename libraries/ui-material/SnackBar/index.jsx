import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { config } from 'react-spring';
import { Spring } from 'react-spring/renderprops.cjs';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import styles from './style';

const defaultToast = {};

/**
 * The SnackBar component.
 */
class SnackBar extends Component {
  static propTypes = {
    removeToast: PropTypes.func.isRequired,
    toasts: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    toasts: null,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  timer = null;

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const hasToast = nextProps.toasts.length > 0;

    this.setState({ visible: hasToast });
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  /**
   * Returns the first snack from the state.
   * @returns {Object}
   */
  get snack() {
    const { __ } = this.context.i18n();
    const snack = this.props.toasts.length ? this.props.toasts[0] : defaultToast;

    return {
      ...snack,
      message: __(snack.message || '', snack.messageParams || {}),
      actionLabel: __(snack.actionLabel || ''),
    };
  }

  handleAction = () => {
    clearTimeout(this.timer);
    this.props.toasts[0].action();
    this.hide();
  }

  handleEntered = () => {
    this.timer = setTimeout(this.hide, this.props.toasts[0].duration || 2500);
  }

  handleRest = () => {
    if (this.state.visible) {
      this.handleEntered();
      return;
    }

    this.props.removeToast();
  }

  hide = () => {
    this.setState({ visible: false });
  }

  /**
   * Calculates the required amount of rows for the snack bar.
   * @param {string} message The snack bar message.
   * @param {string} actionLabel The snack bar action label.
   * @return {number}
   */
  calcRows = (message, actionLabel) => {
    /**
     * Calculates the amount of rows for a passed text.
     * @param {string} text The input text.
     * @return {number}
     */
    const calc = text => Math.max(2, Math.ceil(text.length / 40));
    /**
     * First calculate the required amount of rows for the message. Then append the action label
     * once per line and calculate the rows again. Since the action label occupies an own column,
     * we'll get an approximated number for the required rows.
     */
    return calc(`${message}${actionLabel.repeat(calc(message))}`);
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { visible } = this.state;
    const {
      action = null,
      actionLabel = null,
      message = null,
    } = this.snack;

    // Action exits without actionLabel. Handle the whole box
    const boxProps = {
      ...(action && !actionLabel) && { onClick: this.handleAction },
    };

    // Calculate the required amount of rows and the height of the snack bar.
    const rows = this.calcRows(message, actionLabel);
    const snackBarHeight = 40 + (rows * 20);

    return (
      <div className={styles.container} style={{ '--snack-bar-height': `${snackBarHeight}px` }}>
        <Spring
          from={{ top: snackBarHeight }}
          to={{ top: 0 }}
          config={config.stiff}
          reverse={!visible}
          force
          onRest={this.handleRest}
        >
          {props => (
            <div className={styles.wrapper} style={props} data-footer-inset-update-ignore="true">
              <div className={styles.box} {...boxProps}>
                <Ellipsis rows={rows}>
                  <span className={styles.label} aria-live="assertive" role="status">
                    {message}
                  </span>
                </Ellipsis>
                {(action && actionLabel) && (
                  <button
                    className={styles.button}
                    onClick={this.handleAction}
                    type="button"
                    aria-hidden
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}

export default SnackBar;
