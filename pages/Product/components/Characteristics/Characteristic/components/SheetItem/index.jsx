import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withForwardedRef } from '@shopgate/engage/core';
import styles from './style';

/**
 * The SheetItem component.
 */
class SheetItem extends PureComponent {
  static propTypes = {
    item: PropTypes.shape().isRequired,
    forwardedRef: PropTypes.shape(),
    onClick: PropTypes.func,
    rightComponent: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    forwardedRef: null,
    onClick() { },
    rightComponent: null,
    selected: false,
  };

  /**
   * @param {boolean} selectable Whether or not the item can be selected.
   * @returns {string}
   */
  getStyle = (selectable) => {
    const { selected } = this.props;

    if (selected) {
      return styles.buttonSelected;
    }

    if (!selectable) {
      return styles.buttonDisabled;
    }

    return styles.button;
  };

  /**
   * @returns {Object}
   */
  buildProps = () => {
    const {
      item, onClick, forwardedRef,
    } = this.props;

    return {
      className: this.getStyle(item.selectable),
      key: item.id,
      ref: forwardedRef,
      value: item.id,
      'aria-hidden': !item.selectable,
      ...item.selectable && { onClick },
    };
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { item, rightComponent: Right, selected } = this.props;

    return (
      <button {...this.buildProps()} data-test-id={item.label} aria-selected={selected} role="option">
        {item.label}
        {item.selectable && <Right />}
      </button>
    );
  }
}

export default withForwardedRef(SheetItem);
