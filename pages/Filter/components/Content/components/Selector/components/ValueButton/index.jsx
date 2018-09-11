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
   * @returns {JSX}
   */
  render() {
    const {
      label, id, isActive, onClick,
    } = this.props;

    return (
      <button
        className={classNames({
          [styles.inactive]: !isActive,
          [styles.active]: isActive,
        })}
        value={id}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
}

export default ValueButton;
