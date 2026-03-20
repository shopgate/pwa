import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, keyframes } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const fadeDuration = 150;
const slideDuration = 150;
const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const slideInPickerModal = keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutPickerModal = keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const fadeInPickerBackground = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.5 },
});

const fadeOutPickerBackground = keyframes({
  '0%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

/**
 * The picker modal.
 */
class PickerModal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  /**
   * The constructor.
   * @param {Object} props The props.
   */
  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      active: true,
    };
  }

  /**
   * Update state when isOpen changes.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState({ active: nextProps.isOpen });
    }
  }

  /**
   * Closes the modal after the closing animations have finished.
   */
  closeModal = () => {
    this.setState({ active: false });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.props.onClose, Math.max(slideDuration, fadeDuration));
  };

  /**
   * Render all the things!
   * @returns {JSX} The picker modal with the picker list inside.
   */
  render() {
    const classes = withStyles.getClasses(this.props);
    const backgroundClassName = classNames(
      classes.backgroundBase,
      { [classes.backgroundInactive]: !this.state.active }
    );

    const containerClassName = classNames(
      classes.containerBase,
      { [classes.containerInactive]: !this.state.active }
    );

    return (this.props.isOpen) ? (
      <div
        className={`${classes.wrapper} common__picker__modal`}
      >
        <div
          aria-hidden
          className={backgroundClassName}
          onClick={this.closeModal}
        />
        <div className={containerClassName}>
          {React.cloneElement(
            this.props.children,
            { onClose: this.closeModal }
          )}
        </div>
      </div>
    ) : null;
  }
}

export default withStyles(PickerModal, () => ({
  wrapper: {
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    animation: `${fadeInPickerBackground} ${fadeDuration}ms 1 both`,
  },
  backgroundInactive: {
    animation: `${fadeOutPickerBackground} ${fadeDuration}ms 1 both`,
  },
  containerBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.light,
    animation: `${slideInPickerModal} ${slideDuration}ms 1 both ${easing}`,
  },
  containerInactive: {
    animation: `${slideOutPickerModal} ${slideDuration}ms 1 both ${easing}`,
  },
}));
