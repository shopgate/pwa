import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Field from './components/Field';
import Icon from './components/Icon';
import Title from './components/Title';
import styles from './style';

/**
 * The AppBar component.
 */
class AppBar extends PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    below: PropTypes.shape(),
    center: PropTypes.shape(),
    left: PropTypes.shape(),
    right: PropTypes.shape(),
    textColor: PropTypes.string,
  }

  static defaultProps = {
    backgroundColor: '#fff',
    below: null,
    center: null,
    left: null,
    right: null,
    textColor: '#000',
  }

  static Field = Field;
  static Icon = Icon;
  static Title = Title;

  /**
   * @returns {Object}
   */
  get style() {
    const { backgroundColor, textColor } = this.props;

    return {
      background: backgroundColor,
      color: textColor,
    };
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      below, center, left, right,
    } = this.props;

    return (
      <header
        className={styles.outer}
        data-test-id="Navigator"
        role="banner"
        style={this.style}
      >
        <div className={styles.inner}>
          {left}
          {center}
          {right}
        </div>
        {below}
      </header>
    );
  }
}

export default AppBar;
