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
   * @param {SyntheticEvent} event The synthetic event object.
   */
  handleOnclick = (event) => {
    event.preventDefault();
    const { id, onClick } = this.props;
    onClick(id);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { isActive, label } = this.props;

    return (
      <button
        className={classNames({
          [styles.inactive]: !isActive,
          [styles.active]: isActive,
        })}
        onClick={this.handleOnclick}
      >
        {label}
      </button>
    );
  }
}

export default ValueButton;
