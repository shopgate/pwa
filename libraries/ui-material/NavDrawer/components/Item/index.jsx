import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { withForwardedRef } from '@shopgate/engage/core';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The NavDrawerItem component.
 */
class NavDrawerItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    'aria-hidden': PropTypes.bool,
    'aria-label': PropTypes.string,
    badge: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.shape(),
    ]),
    forwardedRef: PropTypes.shape(),
    icon: PropTypes.func,
    onClick: PropTypes.func,
    srOnly: PropTypes.bool,
    style: PropTypes.shape(),
    testId: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    'aria-label': null,
    badge: null,
    forwardedRef: null,
    icon: null,
    onClick: () => { },
    srOnly: false,
    style: {},
    testId: null,
  };

  /**
   * Only re-render when the label prop changes.
   * @param {Object} nextProps The next component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.label !== nextProps.label ||
      this.props['aria-label'] !== nextProps['aria-label'];
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
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      badge: Badge,
      forwardedRef,
      icon: Icon,
      label,
      srOnly,
      style,
      testId,
    } = this.props;

    return (
      <button
        ref={forwardedRef}
        className={srOnly ? styles.srOnly : styles.button}
        data-test-id={testId}
        onClick={this.handleClick}
        style={style}
        type="button"
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        tabIndex="0"
      >
        <div className={styles.iconWrapper}>
          {Icon && <Icon className={styles.icon} size={24} />}
        </div>
        <I18n.Text className={styles.label} string={label} />
        {Badge && <Badge />}
      </button>
    );
  }
}

export default withForwardedRef(NavDrawerItem);
