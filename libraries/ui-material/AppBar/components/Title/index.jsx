import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarTitle component.
 */
class AppBarTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { onClick, title } = this.props;

    return (
      <div className={styles} data-test-id={`title: ${title}`}>
        <span aria-hidden onClick={onClick}>
          {title}
        </span>
      </div>
    );
  }
}

export default AppBarTitle;
