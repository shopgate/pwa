import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
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
    'aria-hidden': PropTypes.bool,
    backgroundColor: PropTypes.string,
    below: PropTypes.node,
    center: PropTypes.node,
    classes: PropTypes.shape({
      inner: PropTypes.string,
      outer: PropTypes.string,
    }),
    left: PropTypes.node,
    right: PropTypes.node,
    textColor: PropTypes.string,
  }

  static defaultProps = {
    'aria-hidden': null,
    backgroundColor: themeColors.light,
    below: null,
    center: null,
    classes: {
      inner: '',
      outer: '',
    },
    left: null,
    right: null,
    textColor: themeColors.dark,
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
      below, center, left, right, classes, 'aria-hidden': ariaHidden,
    } = this.props;
    const sectionClasses = classnames(styles.outer, classes.outer);

    return (
      <section
        className={sectionClasses}
        data-test-id="Navigator"
        style={this.style}
        aria-hidden={ariaHidden}
      >
        <div className={classnames(styles.inner, classes.inner)}>
          <Left elements={left} />
          <Center elements={center} />
          <Right elements={right} />
        </div>
        <Below elements={below} />
      </section>
    );
  }
}

export default AppBar;
