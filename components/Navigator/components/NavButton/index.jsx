import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { UI_TOGGLE_NAVDRAWER } from '@shopgate/pwa-common/constants/ui';
import Button from '@shopgate/pwa-common/components/Button';
import { ArrowIcon, BurgerIcon, CrossIcon } from '@shopgate/pwa-ui-shared';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { showBackButton, showCloseButton } from './helpers';
import connect from './connector';
import styles from './style';

/**
 * The NavButton component.
 */
class NavButton extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    pattern: PropTypes.string.isRequired,
  };

  static defaultProps = {
    showIconShadow: false,
  };

  /**
   * The component only should update if the type changed.
   * @param {Object} nextProps The next props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.showIconShadow !== this.props.showIconShadow;
  }

  /**
   * Handles a click on the icon.
   */
  handleClick = () => {
    if (this.state.backButton || this.state.closeButton) {
      this.props.close();
    } else {
      NavDrawer.open();
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Button className={styles} onClick={this.handleClick}>
        <BurgerIcon />
      </Button>
    );
  }
}

export default connect(NavButton);
