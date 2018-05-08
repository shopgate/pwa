import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Ripple from '../../../Ripple';
import CrossIcon from '../../../icons/CrossIcon';
import styles from './style';

/**
 * Header component.
 */
class Header extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onToggleClose: PropTypes.func,
  };

  /**
   * The component's default props.
   * @type {Object}
   */
  static defaultProps = {
    onToggleClose: () => {},
  };

  /**
   * Only re-render when the title changes.
   * @param {Object} nextProps Next Props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.title !== nextProps.title);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <Grid component="div" wrap={false}>
        <button className={styles.closeButton} onClick={this.props.onToggleClose}>
          <Ripple className={styles.closeIcon}>
            <CrossIcon size={24} />
          </Ripple>
        </button>
        <Grid.Item className={styles.title} component="div" grow={1}>
          {this.props.title}
        </Grid.Item>
      </Grid>
    );
  }
}

export default Header;
