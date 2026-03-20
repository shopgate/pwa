import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, cx } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import IndicatorCircle from '../IndicatorCircle';
import RippleButton from '../RippleButton';

const halfGapBig = themeConfig.variables.gap.big / 2;

/**
 * The action button component.
 */
class ActionButton extends Component {
  static clickDelay = 300;

  static propTypes = {
    ...RippleButton.propTypes,
    onClick: PropTypes.func.isRequired,
    disableClickDelay: PropTypes.bool,
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
    disableClickDelay: false,
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

    if (this.props.disableClickDelay) {
      this.props.onClick(event);
      return;
    }

    setTimeout(() => {
      this.props.onClick(event);
    }, clickDelay);
  };

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    const classes = withStyles.getClasses(this.props);

    if (this.props.loading) {
      return (
        <div className={classes.containerCircle}>
          <IndicatorCircle />
        </div>
      );
    }

    const containerClass = this.props.noGap ? classes.noGap : classes.withGap;

    return (
      <div
        className={cx('ui-shared__action-button', containerClass)}
        data-test-id={this.props.testId}
      >
        <RippleButton {...this.buttonProps} onClick={this.handleClick}>
          {this.props.children}
        </RippleButton>
      </div>
    );
  }
}

const StyledActionButton = withStyles(ActionButton, {
  withGap: {
    textAlign: 'center',
    margin: `${halfGapBig}px 0`,
  },
  noGap: {
    textAlign: 'center',
  },
  containerCircle: {
    textAlign: 'center',
    margin: `${halfGapBig + 5}px 0`,
  },
});

StyledActionButton.propTypes = ActionButton.propTypes;
StyledActionButton.defaultProps = ActionButton.defaultProps;
StyledActionButton.clickDelay = ActionButton.clickDelay;

export default StyledActionButton;
