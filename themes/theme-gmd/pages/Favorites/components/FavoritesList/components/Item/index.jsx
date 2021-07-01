import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import Grid from '@shopgate/pwa-common/components/Grid';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import CardItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import CTAButtons from './components/CTAButtons';
import Image from './components/Image';
import ProductInfo from './components/ProductInfo';
import styles from './style';

/**
 * Renders Favorites list item.
 * @returns {JSX}
 */
class Item extends Component {
  static propTypes = {
    product: PropTypes.shape(),
  };

  static defaultProps = {
    product: null,
  };

  state = { visible: true }

  /**
   * Component did update callback.
   */
  componentDidUpdate() {
    this.height = this.getHeight();
  }

  /**
   * Measures height.
   * @returns {number}
   */
  getHeight = () => {
    if (!this.refElement) {
      return 0;
    }
    // eslint-disable-next-line react/no-find-dom-node
    return getAbsoluteHeight(findDOMNode(this.refElement));
  };

  /**
   * Get the element height to determine the translate distance
   * @param {Object} element Component ref
   */
  saveRef = (element) => {
    if (this.refElement) {
      return;
    }
    this.refElement = element;
  };

  /**
   * Renders favorite list item
   * @returns {XML}
   */
  render() {
    const { product } = this.props;
    if (!product) {
      return null;
    }
    return (
      <Transition
        in={this.state.visible}
        timeout={styles.favItemTransitionDuration}
        key={this.props.product.id}
      >
        {state => (
          <div ref={this.saveRef}>
            <CardItem
              className={
                styles.getFavItemTransitionStyle(state, this.state.visible, this.height)
              }
            >
              <Grid className={styles.row}>
                <Grid.Item grow={1} className={styles.rightColumn}>
                  <ProductInfo product={this.props.product} />
                </Grid.Item>
                <Grid.Item className={styles.leftColumn}>
                  <Image product={this.props.product} />
                  <CTAButtons
                    productId={this.props.product.id}
                    active={this.state.visible}
                    removeThrottle={styles.favItemTransitionDuration + 200}
                    onRippleComplete={(active) => {
                      this.setState({
                        visible: active,
                      });
                    }}
                    favoritesOnce
                  />
                </Grid.Item>
              </Grid>
            </CardItem>
          </div>
        )}
      </Transition>
    );
  }
}

export default Item;
