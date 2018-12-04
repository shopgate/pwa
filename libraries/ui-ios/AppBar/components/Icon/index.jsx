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
    background: PropTypes.string,
    badge: PropTypes.func,
    color: PropTypes.string,
  };

  static defaultProps = {
    background: 'inherit',
    badge: null,
    color: 'inherit',
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      background, badge: Badge, color, icon: Icon, onClick, ...iconProps
    } = this.props;

    return (
      <div
        aria-hidden
        className={styles}
        onClick={onClick}
        style={{
          background,
          color,
        }}
      >
        <Icon key="icon" {...iconProps} />
        {Badge && <Badge key="badge" />}
      </div>
    );
  }
}

export default AppBarIcon;
