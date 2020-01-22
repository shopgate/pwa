import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as styles from './style';

/**
 * The value button component.
 */
class ValueButton extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    isActive: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    id: null,
    label: null,
    isActive: false,
    onClick() { },
  };

  /**
   * @returns {string}
   */
  get className() {
    const { isActive } = this.props;

    return classNames({
      [styles.inactive]: !isActive,
      [styles.active]: isActive,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      label, id, onClick, isActive,
    } = this.props;

    return (
      <button
        className={this.className}
        value={id}
        onClick={onClick}
        data-test-id={id}
        type="button"
        role="checkbox"
        aria-checked={isActive}
      >
        {label}
      </button>
    );
  }
}

export default ValueButton;
