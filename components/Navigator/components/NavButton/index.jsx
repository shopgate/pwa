import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import BurgerIcon from '@shopgate/pwa-ui-shared/icons/BurgerIcon';
import connect from './connector';
import styles from './style';

/**
 * The NavButton component.
 */
class NavButton extends Component {
  static propTypes = {
    toggleNavDrawer: PropTypes.func.isRequired,
    showIconShadow: PropTypes.bool,
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
    this.props.toggleNavDrawer(true);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Button
        className={styles}
        onClick={this.handleClick}
      >
        <BurgerIcon />
      </Button>
    );
  }
}

export default connect(NavButton);
