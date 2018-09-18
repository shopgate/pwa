import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The SheetItem component.
 */
class SheetItem extends PureComponent {
  static propTypes = {
    item: PropTypes.shape().isRequired,
    onClick: PropTypes.func,
    rightComponent: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
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
    const { item, onClick } = this.props;

    return {
      className: this.getStyle(item.selectable),
      key: item.id,
      value: item.id,
      ...item.selectable && { onClick },
    };
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { item, rightComponent: Right } = this.props;

    return (
      <button {...this.buildProps()} data-test-id={item.label}>
        {item.label}
        {item.selectable && <Right />}
      </button>
    );
  }
}

export default SheetItem;
