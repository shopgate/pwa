import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IndicatorCircle from '../IndicatorCircle';
import RippleButton from '../RippleButton';
import styles from './style';

/**
 * The action button component.
 */
class ActionButton extends Component {
  static clickDelay = 300;

  static propTypes = {
    ...RippleButton.propTypes,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    noGap: PropTypes.bool,
    testId: PropTypes.string,
  };

  static defaultProps = {
    ...RippleButton.defaultProps,
    loading: false,
    type: 'primary',
    flat: true,
    noGap: false,
    testId: null,
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    const buttonProps = {
      className: this.props.className,
      disabled: this.props.disabled,
      flat: this.props.flat,
      type: this.props.type,
    };

    return buttonProps;
  }

  /**
   * The click handler
   * @param {Object} event The event object for the click handler
   */
  handleClick = (event) => {
    const { clickDelay } = this.constructor;

    setTimeout(() => {
      this.props.onClick(event);
    }, clickDelay);
  };

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    const containerClass = this.props.noGap ? styles.noGapContainer : styles.container;

    if (this.props.loading) {
      return (
        <div className={styles.containerCircle}>
          <IndicatorCircle />
        </div>
      );
    }

    return (
      <div className={containerClass} data-test-id={this.props.testId}>
        <RippleButton {...this.buttonProps} onClick={this.handleClick}>
          {this.props.children}
        </RippleButton>
      </div>
    );
  }
}

export default ActionButton;
