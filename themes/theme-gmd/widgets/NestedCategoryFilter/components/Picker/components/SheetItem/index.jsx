import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The SheetItem component.
 */
class SheetItem extends PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    onClick() { },
    selected: false,
  };

  /**
   * Creates props for the button.
   * @returns {Object}
   */
  buildProps = () => {
    const { item, selected, onClick } = this.props;

    return {
      className: classNames({
        [styles.button]: !selected,
        [styles.buttonSelected]: selected,
      }),
      key: item.id,
      value: item.id,
      onClick,
    };
  };

  /**
   * Render method of the component.
   * @returns {JSX}
   */
  render() {
    const { item } = this.props;

    return (
      <button {...this.buildProps()} type="button">
        {item.name}
      </button>
    );
  }
}

export default SheetItem;
