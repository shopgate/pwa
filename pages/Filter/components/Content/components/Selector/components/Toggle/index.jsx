import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as styles from './style';

/**
 * The toggle component.
 */
class Toggle extends PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    open: PropTypes.bool,
    selected: PropTypes.node,
  };

  static defaultProps = {
    open: false,
    selected: null,
  };

  /**
   * @returns {string}
   */
  get className() {
    const { open } = this.props;

    return classNames({
      [styles.label]: true,
      [styles.open]: open,
      [styles.closed]: !open,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { label, selected } = this.props;

    return (
      <div className={styles.toggle}>
        <span className={this.className}>
          {label}
        </span>
        {selected && (
          <span className={styles.selected}>{selected}</span>
        )}
      </div>
    );
  }
}

export default Toggle;
