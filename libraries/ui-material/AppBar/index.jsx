import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';
import Field from './components/Field';
import Icon from './components/Icon';
import Title from './components/Title';
import Right from './components/Right';
import Center from './components/Center';
import Left from './components/Left';
import Below from './components/Below';
import styles from './style';

/**
 * The AppBar component.
 */
class AppBar extends PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    below: PropTypes.node,
    center: PropTypes.node,
    left: PropTypes.node,
    right: PropTypes.node,
    shadow: PropTypes.bool,
    textColor: PropTypes.string,
  }

  static defaultProps = {
    backgroundColor: themeColors.light,
    below: null,
    center: null,
    left: null,
    right: null,
    shadow: true,
    textColor: themeColors.dark,
  }

  static Field = Field;

  static Icon = Icon;

  static Title = Title;

  /**
   * @returns {Object}
   */
  get style() {
    const { backgroundColor, shadow, textColor } = this.props;

    return {
      background: backgroundColor,
      color: textColor,
      boxShadow: !shadow ? 'none' : themeShadows.material,
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
      <header className={`${styles.outer} ui-material__app-bar`} data-test-id="Navigator" role="banner" style={this.style}>
        <div className={styles.inner}>
          <Left elements={left} />
          <Center elements={center} />
          <Right elements={right} />
        </div>
        <Below elements={below} />
      </header>
    );
  }
}

export default AppBar;
