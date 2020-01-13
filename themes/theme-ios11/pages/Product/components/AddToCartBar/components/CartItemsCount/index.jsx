import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import CheckIcon from '@shopgate/pwa-ui-shared/icons/CheckIcon';
import Count from './components/Count';
import styles, { duration, durationShort, transition } from './style';

/**
 * The cart items count component.
 * @extends Component
 */
class CartItemsCount extends Component {
  static propTypes = {
    itemCount: PropTypes.number.isRequired,
  };

  /**
   * @param {Object} props The next props.
   * @param {Object} state The component state.
   * @returns {Object}
   */
  static getDerivedStateFromProps(props, state) {
    const numItems = props.itemCount;

    // When there are no items, reset this element to hide.
    if (numItems === 0) {
      return {
        isVisible: false,
        numItems,
      };
    }

    // Set to visible when is currently invisible and has items.
    if (!state.isVisible && numItems > 0) {
      return {
        isVisible: true,
        numItems,
      };
    }

    // Just update the value if the number of items changed.
    if (state.numItems !== numItems) {
      return {
        numItems,
      };
    }

    return null;
  }

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      numItems: props.itemCount,
      isVisible: props.itemCount > 0,
    };
  }

  /**
   * Only update if the cart product count changed.
   * @param {Object} nextProps The next props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isVisible !== nextState.isVisible
      || this.state.numItems !== nextState.numItems
    );
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <Transition
        in={this.state.isVisible}
        timeout={{
          enter: duration,
          exit: durationShort,
        }}
      >
        {state => (
          <div className={styles.container} style={transition[state]} aria-hidden>
            <div className={styles.check}>
              <CheckIcon />
            </div>
            <Count count={this.state.numItems} />
          </div>
        )}
      </Transition>
    );
  }
}

export default CartItemsCount;
