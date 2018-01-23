/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Glow from 'Components/Glow';
import styles from './style';

/**
 * The list item component.
 */
class Item extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    image: PropTypes.element,
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    link: PropTypes.string,
    onClick: PropTypes.func,
    rightComponent: PropTypes.element,
  };

  static defaultProps = {
    className: null,
    image: null,
    isDisabled: false,
    isSelected: false,
    link: null,
    onClick: null,
    rightComponent: null,
  };

  /**
   * Should only update what the `selected` or `disabled` props change.
   * @param {Object} nextProps The next set of component props.
   * @returns {JSX}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isSelected !== nextProps.isSelected ||
      this.props.isDisabled !== nextProps.isDisabled
    );
  }

  /**
   * Renders the bulk of the content.
   * @returns {JSX}
   */
  renderContent() {
    const { isDisabled, isSelected, title } = this.props;

    let gridStyles = styles.grid;
    let titleStyles = styles.title;

    if (isSelected) {
      gridStyles += ` ${styles.selected}`;
    }

    if (isDisabled) {
      titleStyles += ` ${styles.disabled}`;
    }

    return (
      <Grid className={gridStyles} component="div">
        <div className={styles.image}>
          {this.props.image}
        </div>
        <Grid.Item
          className={titleStyles}
          component="div"
          grow={1}
        >
          {title}
        </Grid.Item>
        {this.props.rightComponent &&
          <Grid.Item component="div" grow={1}>
            {this.props.rightComponent}
          </Grid.Item>
        }
      </Grid>
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    /**
     * If this item is disabled, selected or doesn't have a valid
     * link or click handler then wrap the content with other components.
     */
    if (
      this.props.isDisabled ||
      (!this.props.link && !this.props.onClick)
    ) {
      return this.renderContent();
    }

    // Wrap with a <Link> if the `link` prop is set.
    if (this.props.link) {
      return (
        <Glow className={this.props.className}>
          <Link href={this.props.link} onClick={this.props.onClick}>
            {this.renderContent()}
          </Link>
        </Glow>
      );
    }

    return (
      <div aria-hidden onClick={this.props.onClick}>
        <Glow className={this.props.className}>
          {this.renderContent()}
        </Glow>
      </div>
    );
  }
}

export default Item;
