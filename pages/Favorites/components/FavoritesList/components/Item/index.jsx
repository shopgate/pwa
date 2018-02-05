/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import CardItem from 'Components/CardList/components/Item';
import FavoritesButton from 'Components/FavoritesButton';
import Grid from '@shopgate/pwa-common/components/Grid';
import Image from './components/Image';
import ProductInfo from './components/ProductInfo';
import styles from './style';

/**
 * Renders Favorites list item.
 * @param {Object} product Product.
 * @returns {XML}
 */
class Item extends Component {
  static propTypes = {
    product: PropTypes.shape().isRequired,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);
    this.initialHeight = 0;
    this.state = {
      visible: true,
    };
  }

  /**
   * Get the element height to determin the translate distance
   * @param {Object} element Component ref
   */
  adjustHeight = (element) => {
    if (!element || this.initialHeight > 0) {
      return;
    }
    this.initialHeight = getAbsoluteHeight(findDOMNode(element));
    if (!this.initialHeight) {
      return;
    }
    // Add 4px to comply to the padding of the card item
    this.initialHeight += 4;
  };

  /**
   * Renders favorite list item
   * @returns {XML}
   */
  render() {
    return (
      <Transition
        in={this.state.visible}
        timeout={styles.favItemTransitionDuration}
        key={this.props.product.id}
      >
        {state => (
          <CardItem
            ref={this.adjustHeight}
            className={
              styles.getFavItemTransitionStyle(state, this.state.visible, this.initialHeight)
            }
          >
            <Grid className={styles.row}>
              <Grid.Item className={styles.leftColumn}>
                <Image product={this.props.product} />
                <div className={styles.favButtonWrapper}>
                  <FavoritesButton
                    productId={this.props.product.id}
                    active={this.state.visible}
                    removeThrottle={styles.favItemTransitionDuration + 200}
                    onRippleComplete={(active) => {
                      this.setState({
                        visible: active,
                      });
                    }}
                    readOnlyOnFetch
                  />
                </div>
              </Grid.Item>
              <Grid.Item grow={1} className={styles.rightColumn}>
                <ProductInfo product={this.props.product} />
              </Grid.Item>
            </Grid>
          </CardItem>
        )}
      </Transition>
    );
  }
}

export default Item;
