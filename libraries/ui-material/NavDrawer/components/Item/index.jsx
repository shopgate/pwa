import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The NavDrawerItem component.
 */
class NavDrawerItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    'aria-hidden': PropTypes.bool,
    badge: PropTypes.func,
    icon: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.shape(),
    testId: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': true,
    badge: null,
    icon: null,
    onClick: () => { },
    style: {},
    testId: null,
  };

  /**
   * Only re-render when the label prop changes.
   * @param {Object} nextProps The next component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.label !== nextProps.label;
  }

  /**
   * Handles an Item click by executing it's href.
   * @param {Object} props The component props.
   */
  handleClick = () => {
    UIEvents.emit('navdrawer_close');
    setTimeout(this.props.onClick, 300);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      badge: Badge,
      icon: Icon,
      label,
      style,
      testId,
      'aria-hidden': ariaHidden,
    } = this.props;

    return (
      <button
        className={styles.button}
        data-test-id={testId}
        onClick={this.handleClick}
        role="link"
        style={style}
        aria-hidden={ariaHidden}
        tabIndex={ariaHidden ? -1 : 0}
      >
        <div className={styles.iconWrapper} aria-hidden>
          {Icon && <Icon className={styles.icon} size={24} />}
        </div>
        <I18n.Text className={styles.label} string={label} />
        {Badge && <Badge />}
      </button>
    );
  }
}

export default NavDrawerItem;
