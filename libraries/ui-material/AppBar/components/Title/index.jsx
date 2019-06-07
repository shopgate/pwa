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

    /* eslint-disable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
    return (
      <div className={styles} role="heading" data-test-id={`title: ${title}`}>
        <span onClick={onClick}>
          {title}
        </span>
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions,
    jsx-a11y/click-events-have-key-events */
  }
}

export default AppBarTitle;
