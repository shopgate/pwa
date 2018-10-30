import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
    classes: PropTypes.shape(),
    left: PropTypes.shape(),
    right: PropTypes.shape(),
    textColor: PropTypes.string,
  }

  static defaultProps = {
    backgroundColor: '#fff',
    below: null,
    center: null,
    classes: { inner: '', outer: '' },
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
      below, center, left, right, classes,
    } = this.props;

    return (
      <header
        className={classnames(styles.outer, classes.outer)}
        data-test-id="Navigator"
        role="banner"
        style={this.style}
      >
        <div className={classnames(styles.inner, classes.inner)}>
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
