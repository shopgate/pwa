import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';
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
      <div className={classNames(styles.root, {
        [styles.rootSelected]: selected,
      })}
      >
        <button {...buildProps} data-test-id={item.label} aria-selected={selected} role="option" type="button">
          <div className={styles.mainRow}>
            <div>
              {item.label}
            </div>
            <div className={styles.mainRowRight}>
              {item.selectable && <Right />}
            </div>
          </div>
        </button>
        <div className={styles.bottomRow}>
          {item.selectable && (
          <CharacteristicsButton characteristics={characteristics} />
          )}
        </div>
      </div>
    );
  }
}

export default withForwardedRef(SheetItem);
