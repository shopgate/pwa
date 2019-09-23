import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The AppBarIcon component.
 */
class AppBarIcon extends PureComponent {
  static propTypes = {
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    'aria-hidden': PropTypes.bool,
    'aria-label': PropTypes.string,
    background: PropTypes.string,
    badge: PropTypes.func,
    color: PropTypes.string,
    testId: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    'aria-label': null,
    background: 'inherit',
    badge: null,
    color: 'inherit',
    testId: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      background, badge: Badge, color, icon: Icon, onClick, testId, 'aria-hidden': ariaHidden, 'aria-label': ariaLabel,
    } = this.props;

    return (
      <button
        className={styles}
        onClick={onClick}
        style={{
          background,
          color,
        }}
        data-test-id={testId}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        type="button"
      >
        <Icon />
        {Badge && <Badge />}
      </button>
    );
  }
}

export default AppBarIcon;
