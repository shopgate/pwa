import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spring } from 'react-spring';
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

  state = {
    snacks: [],
    visible: true,
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const hasToast = nextProps.toasts.length > 0;

    this.setState({
      render: hasToast,
      snacks: nextProps.toasts,
      visible: hasToast,
    });
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { render, visible } = this.state;

    return (
      render !== nextState.render ||
      visible !== nextState.visible
    );
  }

  /**
   * Returns the first snack from the state.
   * @returns {Object}
   */
  get snack() {
    return this.state.snacks.length ? this.state.snacks[0] : defaultToast;
  }

  timer = null;

  handleAction = () => {
    clearTimeout(this.timer);
    this.state.snacks[0].action();
    this.hide();
  }

  handleEntered = () => {
    this.timer = setTimeout(this.hide, 2500);
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

  show = () => {
    this.setState({ visible: true });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { visible } = this.state;
    const { action = null, actionLabel = null, message = null } = this.snack;

    return (
      <Spring
        from={{ y: 0 }}
        to={{ y: -100 }}
        config={{ tension: 200, friction: 18 }}
        reverse={!visible}
        force
        onRest={this.handleRest}
      >
        {props => (
          <div className={styles.wrapper} style={{ transform: `translateY(${props.y}%)` }}>
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
      </Spring>
    );
  }
}

export default SnackBar;
