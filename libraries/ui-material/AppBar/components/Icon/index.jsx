import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScreenReaderLabel } from '@shopgate/pwa-common/components';
import styles from './style';

/**
 * The AppBarIcon component.
 */
class AppBarIcon extends PureComponent {
  static propTypes = {
    icon: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    ariaHidden: PropTypes.string,
    background: PropTypes.string,
    badge: PropTypes.func,
    color: PropTypes.string,
    srLabel: PropTypes.string,
    testId: PropTypes.string,
  };

  static defaultProps = {
    ariaHidden: null,
    background: 'inherit',
    badge: null,
    color: 'inherit',
    testId: null,
    srLabel: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      background, badge: Badge, color, icon: Icon, onClick, testId, ariaHidden, srLabel,
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
      >
        {srLabel && <ScreenReaderLabel label={srLabel} />}
        <Icon />
        {Badge && <Badge />}
      </button>
    );
  }
}

export default AppBarIcon;
