/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import {findDOMNode} from 'react-dom';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import {bin2hex} from '@shopgate/pwa-common/helpers/data';
import {getAbsoluteHeight} from '@shopgate/pwa-common/helpers/dom';
import CardItem from 'Components/CardList/components/Item';
import ProductCharacteristics from 'Components/ProductCharacteristics';
import Grid from '@shopgate/pwa-common/components/Grid';
import ProductImage from 'Components/ProductImage';
import AvailableText from 'Components/Availability';
import FavoritesButton from 'Components/FavoritesButton';
import Price from './components/Price';
import styles from '../../style';

/**
 * Renders Favorites list item.
 * @param {Object} product Product.
 * @returns {XML}
 */
class Item extends Component {
  static propTypes = {
    product: PropTypes.shape().isRequired,
    deleteProduct: PropTypes.func,
  };

  static defaultProps = {
    product: null,
    deleteProduct: () => {
    },
  };

  /**
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidMount() {
    this.initialHeight = `${getAbsoluteHeight(findDOMNode(this.transitionElement)) + 4}px`;
    this.transitionElement.style.height = this.initialHeight;
  }

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  render() {
    return (
      <Transition in={this.state.visible} timeout={styles.favItemTransitionDuration}>
        {state => (
          <CardItem key={this.props.product.id}>
            <div style={styles.itemWrapper}>
              <div
                ref={element => {
                  this.transitionElement = element;
                }}
                key={this.props.product.id}
                style={{
                  ...styles.getFavItemTransitionStyle(state),
                  ...(!this.state.visible && {
                    transform: `translateY(-${this.initialHeight})`
                  })
                }}
              >
                <Grid className={styles.row}>
                  <Grid.Item className={styles.leftColumn}>
                    <div className={styles.image}>
                      <Link
                        tagName="a"
                        href={`/item/${bin2hex(this.props.product.baseProductId || this.props.product.id)}`}
                        itemProp="item"
                        itemScope
                        itemType="http://schema.org/Product"
                      >
                        <ProductImage src={this.props.product.featuredImageUrl}/>
                      </Link>
                    </div>
                    <FavoritesButton
                      productId={this.props.product.id}
                      active={this.state.visible}
                      removeThrottle={styles.favItemTransitionDuration + 200}
                      onRemove={() => {
                        setTimeout(() => {
                          this.setState({
                            visible: false,
                          });
                        }, 200);
                      }}
                    />
                  </Grid.Item>
                  <Grid.Item grow={1} className={styles.rightColumn}>
                    <div className={styles.name}>
                      <Link
                        tagName="a"
                        href={`/item/${bin2hex(this.props.product.id)}`}
                        itemProp="item"
                        itemScope
                        itemType="http://schema.org/Product"
                      >
                        {this.props.product.name}
                      </Link>
                    </div>
                    <div className={styles.details}>
                      <Grid className={styles.detailsRow}>
                        <Grid.Item className={styles.propertiesContainer}>
                          <ProductCharacteristics
                            characteristics={this.props.product.characteristics}/>
                          <AvailableText
                            text={this.props.product.availability.text}
                            state={this.props.product.availability.state}
                            showWhenAvailable
                          />
                        </Grid.Item>
                        <Grid.Item className={styles.priceContainer}>
                          <Price price={this.props.product.price}/>
                        </Grid.Item>
                      </Grid>
                    </div>
                  </Grid.Item>
                </Grid>
              </div>
            </div>

          </CardItem>
        )}
      </Transition>
    );
  }
}

export default Item;
