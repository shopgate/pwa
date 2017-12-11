/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import ProgressBar from 'Components/ProgressBar';
import colors from 'Styles/colors';
import connect from './connector';
import NavButton from './components/NavButton';
import CartButton from './components/CartButton';
import ApplyFilterButton from './components/ApplyFilterButton';
import Content from './components/Content';
import styles from './style';

/**
 * The navigator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class Navigator extends Component {
  static propTypes = {
    filterOpen: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string,
    isIphoneX: PropTypes.bool,
    navigatorEnabled: PropTypes.bool,
    showLoadingBar: PropTypes.bool,
    showTitle: PropTypes.bool,
    textColor: PropTypes.string,
  };

  static defaultProps = {
    backgroundColor: colors.light,
    isIphoneX: false,
    navigatorEnabled: true,
    showLoadingBar: false,
    showTitle: true,
    textColor: colors.accent,
  };

  /**
   * Only update when the path changes.
   * @param {Object} nextProps The next set of component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.backgroundColor !== nextProps.backgroundColor ||
      this.props.textColor !== nextProps.textColor ||
      this.props.showTitle !== nextProps.showTitle ||
      this.props.filterOpen !== nextProps.filterOpen ||
      this.props.navigatorEnabled !== nextProps.navigatorEnabled ||
      this.props.showLoadingBar !== nextProps.showLoadingBar
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.navigatorEnabled) {
      return null;
    }

    const headerStyle = {
      background: this.props.backgroundColor,
      color: this.props.textColor,
    };

    return (
      <header className={`${styles.header} ${this.props.isIphoneX ? styles.iPhoneXPadding : ''}`} role="banner" style={headerStyle}>
        <Grid className={styles.grid} component="section" wrap={false}>
          <NavButton />
          <Grid.Item className={styles.title} component="div" grow={1}>
            {this.props.showTitle &&
              <Content />
            }
          </Grid.Item>
          {(this.props.filterOpen) &&
            <div className={styles.applyButton}>
              <ApplyFilterButton />
            </div>
          }
          <CartButton />
        </Grid>
        <ProgressBar isVisible={this.props.showLoadingBar} />
      </header>
    );
  }
}

export default connect(Navigator);
