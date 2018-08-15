import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@shopgate/pwa-common/components/Grid';
import connect from './connector';
import styles from './style';

/**
 * The NavDrawerItem component.
 */
class Item extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    close: PropTypes.func,
    count: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    href: PropTypes.string,
    icon: PropTypes.func,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
    testId: PropTypes.string,
    withIndicator: PropTypes.bool,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    close: () => { },
    count: null,
    href: '',
    icon: null,
    onClick: () => { },
    primary: false,
    testId: null,
    withIndicator: false,
  };

  /**
   * Returns a translated label.
   */
  get label() {
    const { __ } = this.context.i18n();
    return __(this.props.label);
  }
  /**
 * Handles an Item click by executing it's href.
 * @param {Object} props The component props.
 */
  handleClick = () => {
    // Perform onClick callback
    this.props.onClick();

    if (this.props.href) {
      this.props.navigate(this.props.href, { title: this.label });
    }

    // Call close callback from drawer
    this.props.close();
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const className = classNames((
      styles.container, {
        [styles.primary]: this.props.primary,
      }
    ));

    const labelClassName =
      this.props.withIndicator && !this.props.count ? styles.labelWithIndicator : styles.label;

    return (
      <div
        aria-hidden
        className={className}
        data-test-id={this.props.testId}
        onClick={this.handleClick}
      >
        <Grid className={styles.grid}>
          <Grid.Item>
            <div className={styles.icon}>
              {this.props.icon && React.createElement(
                this.props.icon,
                {
                  ...this.props.primary && { className: styles.primaryIcon },
                }
              )}
            </div>
          </Grid.Item>
          <Grid.Item grow={1}>
            <div className={labelClassName}>
              {this.label}
            </div>
          </Grid.Item>
          {this.props.count && (
            <Grid.Item>
              <div className={styles.count}>
                {this.props.count}
              </div>
            </Grid.Item>
          )}
        </Grid>
      </div>
    );
  }
}

export default connect(Item);
