import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import { ArrowIcon, BurgerIcon, CrossIcon } from '@shopgate/pwa-ui-shared';
import { showBackButton, showCloseButton } from './helpers';
import connect from './connector';
import styles from './style';

/**
 * The NavButton component.
 */
class NavButton extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    openNavDrawer: PropTypes.func.isRequired,
    pattern: PropTypes.string.isRequired,
  };

  state = {
    backButton: false,
    closeButton: false,
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    const backButton = showBackButton(nextProps.pattern);
    const closeButton = showCloseButton(nextProps.pattern);

    this.setState({
      backButton,
      closeButton,
    });
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.backButton !== nextState.backButton
      || this.state.closeButton !== nextState.closeButton
    );
  }

  /**
   * @returns {JSX}
   */
  get icon() {
    if (this.state.closeButton) {
      return <CrossIcon />;
    }

    if (this.state.backButton) {
      return <ArrowIcon />;
    }

    return <BurgerIcon />;
  }

  /**
   * Handles a click on the icon.
   */
  handleClick = () => {
    if (this.state.backButton || this.state.closeButton) {
      this.props.close();
    } else {
      this.props.openNavDrawer();
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Button className={styles} onClick={this.handleClick}>
        {this.icon}
      </Button>
    );
  }
}

export default connect(NavButton);
