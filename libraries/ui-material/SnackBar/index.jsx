import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spring, config } from 'react-spring';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import I18n from '@shopgate/pwa-common/components/I18n';
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
    return this.props.toasts.length ? this.props.toasts[0] : defaultToast;
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
   * @returns {JSX}
   */
  render() {
    const { visible } = this.state;
    const {
      action = null, actionLabel = null, message = null, messageParams = {},
    } = this.snack;

    // Action exits without actionLabel. Handle the whole box
    const boxProps = {
      ...(action && !actionLabel) && { onClick: this.handleAction },
    };

    return (
      <div className={styles.container} aria-live="assertive" role="status">
        <Spring
          from={{ top: 80 }}
          to={{ top: 0 }}
          config={config.stiff}
          reverse={!visible}
          force
          onRest={this.handleRest}
        >
          {props => (
            <div className={styles.wrapper} style={props} data-footer-inset-update-ignore="true">
              <div className={styles.box} {...boxProps}>
                <Ellipsis rows={2}>
                  <I18n.Text className={styles.label} string={message || ''} params={messageParams} />
                </Ellipsis>
                {(action && actionLabel) && (
                  <button
                    className={styles.button}
                    onClick={this.handleAction}
                    type="button"
                    aria-hidden
                  >
                    <I18n.Text string={actionLabel} />
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
