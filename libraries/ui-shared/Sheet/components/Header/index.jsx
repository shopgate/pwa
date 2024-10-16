import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@shopgate/pwa-common/components/Grid';
import Ripple from '../../../Ripple';
import CrossIcon from '../../../icons/CrossIcon';
import styles from './style';
import SearchBar from './components/SearchBar';

/**
 * Header component.
 */
class Header extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element, // ex.: I18n.Text
    ]).isRequired,
    allowClose: PropTypes.bool,
    handleChange: PropTypes.func,
    onToggleClose: PropTypes.func,
    shadow: PropTypes.bool,
    showSearch: PropTypes.bool,
  };

  /**
   * The component's default props.
   * @type {Object}
   */
  static defaultProps = {
    onToggleClose: () => {},
    shadow: false,
    allowClose: true,
    handleChange: () => {},
    showSearch: false,
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
    const { allowClose } = this.props;

    const classes = classNames(
      styles.wrapper
    );

    const { __ } = this.context.i18n();

    return (
      <div className={classNames({ [styles.shadow]: this.props.shadow })}>
        <Grid className={classes} component="div" wrap={false}>
          {allowClose ? (
            <button className={styles.closeButton} onClick={this.props.onToggleClose} aria-label={__('common.close')} type="button">
              <Ripple className={styles.closeIcon}>
                <CrossIcon size={24} />
              </Ripple>
            </button>
          ) : <div className={styles.closePlaceholder} />}
          <Grid.Item className={styles.title} component="div" grow={1} role="heading" {...(allowClose ? { tabIndex: 0 } : null)}>
            {this.props.title}
          </Grid.Item>
        </Grid>
        {this.props.showSearch && <SearchBar handleChange={this.props.handleChange} />}
      </div>
    );
  }
}

export default Header;
