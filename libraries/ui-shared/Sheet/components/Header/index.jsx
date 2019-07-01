import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@shopgate/pwa-common/components/Grid';
import Ripple from '../../../Ripple';
import CrossIcon from '../../../icons/CrossIcon';
import styles from './style';

/**
 * Header component.
 */
class Header extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element, // ex.: I18n.Text
    ]).isRequired,
    onToggleClose: PropTypes.func,
    shadow: PropTypes.bool,
  };

  /**
   * The component's default props.
   * @type {Object}
   */
  static defaultProps = {
    onToggleClose: () => {},
    shadow: false,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @param {Object} nextProps Next Props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.shadow !== nextProps.shadow ||
      this.props.title !== nextProps.title
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const classes = classNames(
      styles.wrapper,
      { [styles.shadow]: this.props.shadow }
    );

    const { __ } = this.context.i18n();

    return (
      <Grid className={classes} component="div" wrap={false}>
        <button className={styles.closeButton} onClick={this.props.onToggleClose} aria-label={__('common.close')}>
          <Ripple className={styles.closeIcon}>
            <CrossIcon size={24} />
          </Ripple>
        </button>
        <Grid.Item className={styles.title} component="div" grow={1} role="heading">
          {this.props.title}
        </Grid.Item>
      </Grid>
    );
  }
}

export default Header;
