import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withForwardedRef } from '@shopgate/engage/core';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock';
import styles from './style';

/**
 * The SheetItem component.
 */
class SheetItem extends PureComponent {
  static propTypes = {
    characteristics: PropTypes.shape().isRequired,
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
      className: `${this.getStyle(item.selectable).toString()} theme__product__characteristic__option`,
      key: item.id,
      ref: forwardedRef,
      value: item.id,
      'aria-hidden': !item.selectable,
      ...item.selectable && { onClick: event => onClick(event, item.id) },
    };
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      item,
      rightComponent: Right,
      selected,
      characteristics,
    } = this.props;

    const buildProps = this.buildProps();
    return (
      <button {...buildProps} data-test-id={item.label} aria-selected={selected} role="option" type="button">
        {item.label}
        {item.selectable && <Right />}
        <CharacteristicsButton characteristics={characteristics} />
      </button>
    );
  }
}

export default withForwardedRef(SheetItem);
