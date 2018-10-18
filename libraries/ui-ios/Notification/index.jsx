import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';
import transition from './transition';

const defaultToast = {};

/**
 * The Notification component.
 */
class Notification extends Component {
  static propTypes = {
    removeToast: PropTypes.func.isRequired,
    toasts: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    toasts: null,
  }

  state = {
    notifications: [],
    visible: false,
  }

  /**
   * Assign the incoming toasts to the internal state.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const visible = !!nextProps.toasts.length;

    this.setState({
      notifications: nextProps.toasts,
      visible,
    });
  }

  /**
   * Only re-render when the visibility of the component should change.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  /**
   * Returns the first notification from the state.
   * @returns {Object}
   */
  get notification() {
    return this.state.notifications.length ? this.state.notifications[0] : defaultToast;
  }

  timer = null;

  handleAction = () => {
    clearTimeout(this.timer);
    this.state.notifications[0].action();
    this.hide();
  }

  handleEntered = () => {
    this.timer = setTimeout(this.hide, 2500);
  }

  hide = () => {
    this.setState({ visible: false });
  }

  show = () => {
    this.setState({ visible: true });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { action = null, actionLabel = null, message = null } = this.notification;

    return (
      <Transition
        in={this.state.visible}
        onEntered={this.handleEntered}
        onExited={this.props.removeToast}
        timeout={250}
      >
        {state => (
          <div className={styles.wrapper} style={transition[state]}>
            <div className={styles.box}>
              <Ellipsis rows={2}>
                <I18n.Text className={styles.label} string={message || ''} />
              </Ellipsis>
              {(action && actionLabel) && (
                <button className={styles.button} onClick={this.handleAction}>
                  <I18n.Text string={actionLabel} />
                </button>
              )}
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

export default Notification;
