import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarTitle component.
 */
class AppBarTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { title } = this.props;

    return (
      <div className={styles} role="heading" aria-level="1" data-test-id={`title: ${title}`}>
        {title}
      </div>
    );
  }
}

export default AppBarTitle;
