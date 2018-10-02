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
    forwardRef: PropTypes.shape(),
    left: PropTypes.shape(),
    onMount: PropTypes.func,
    right: PropTypes.shape(),
    textColor: PropTypes.string,
  }

  static defaultProps = {
    backgroundColor: '#fff',
    below: null,
    center: null,
    forwardRef: null,
    left: null,
    onMount: null,
    right: null,
    textColor: '#000',
  }

  static Field = Field;
  static Icon = Icon;
  static Title = Title;

  /**
   * When mounted, call the onMount prop.
   */
  componentDidMount() {
    const { forwardRef, onMount } = this.props;

    if (onMount) {
      onMount(forwardRef);
    }
  }

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
      below, center, forwardRef, left, right,
    } = this.props;

    return (
      <header
        className={styles.outer}
        data-test-id="Navigator"
        ref={forwardRef}
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
