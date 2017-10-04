/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import event from '@shopgate/pwa-core/classes/Event';
import { EVENT_ADD_TO_CART_MISSING_VARIANT } from '@shopgate/pwa-common-commerce/cart/constants';
import I18n from '@shopgate/pwa-common/components/I18n';
import RouteGuard from '@shopgate/pwa-common/components/Router/components/RouteGuard';
import Picker from 'Components/Picker';
import VariantPickerButton from './components/VariantPickerButton';
import ProductVariants from './components/ProductVariants';
import Availability from 'Components/Availability';
import connect from './connector';
import styles from './style';

/**
 * The time the scrolling takes to reach the element.
 * @see Library/helpers/smoothScrollPolyfill.js SCROLL_TIME
 * @type {number}
 */
const SCROLL_TO_PICKER_TIME = 468;

/**
 * The duration of the highlight effect for a single picker.
 * @type {number}
 */
const HIGHLIGHT_PICKER_DURATION = 450;

/**
 * Creates an item for the picker.
 * @param {Object} value The value to create the picker item from.
 * @return {JSX}
 */
const createPickerItem = (value) => {
  const result = {
    value: value.id,
    label: value.label,
    disabled: value.disabled,
    rightComponent: null,
  };

  if (value.availability) {
    result.rightComponent = (
      <Availability
        text={value.availability.text}
        state={value.availability.state}
        className={styles.availability}
      />
    );
  }

  return result;
};

/**
 * VariantSelects component.
 */
class VariantSelects extends Component {
  // Max and min duration time for the Sheet
  static maxDuration = 530;
  static minDuration = 350;
  // Duration time per element in the Sheet
  static durationPerElement = 58;

  static propTypes = {
    closeDelay: PropTypes.number,
    handleSelectionUpdate: PropTypes.func,
    selection: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      selected: PropTypes.bool.isRequired,
      disabled: PropTypes.bool.isRequired,
      values: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
      })),
    })),
    setAnimationState: PropTypes.func,
  };

  static defaultProps = {
    handleSelectionUpdate: () => {},
    setAnimationState: () => {},
    selection: [],
    closeDelay: 300,
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   * @param {Array} props.selection Variants.
   * @param {Array} props.variants Characteristics.
   * @param {function} props.onSelectionUpdate Callback if the characteristics updates
   * @param {boolean} props.isAnimating Flag if a animation is running
   */
  constructor(props) {
    super(props);

    this.notSelectedPickerId = null;
    this.runningTimeout = null;

    this.state = {
      openPickerId: null,
      highlightedPickerId: null,
    };
  }

  /**
   * Registers a callback to the missing variant event.
   */
  componentDidMount() {
    event.addCallback(EVENT_ADD_TO_CART_MISSING_VARIANT, this.handleMissingVariant);
  }

  /**
   * Check if the component should update
   * @param {Object} nextProps The next props
   * @param {Object} nextState The next state
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) || !isEqual(this.props.selection, nextProps.selection);
  }

  /**
   * Clear the timeout and removes the missing variant event callback.
   */
  componentWillUnmount() {
    clearTimeout(this.runningTimeout);
    event.removeCallback(EVENT_ADD_TO_CART_MISSING_VARIANT, this.handleMissingVariant);
  }

  /**
   * Handles the picker onChange
   */
  handleOnClose = () => {
    this.setState({
      openPickerId: null,
    });
  };

  /**
   * Handles the picker onChange
   * @param {string} variantId Id of the variant
   * @param {string} valueId Id of the value
   */
  handleOnChange(variantId, valueId) {
    clearTimeout(this.runningTimeout);

    this.props.handleSelectionUpdate(variantId, valueId);

    this.runningTimeout = setTimeout(() => {
      this.props.setAnimationState(false);
    }, this.props.closeDelay);
  }

  /**
   * When a variant is missing, the first unselected variant selection should be opened and scrolled
   * into view.
   */
  handleMissingVariant = () => {
    if (this.notSelectedPickerId === null) {
      return;
    }

    /**
     * ScrollIntoView scrolls the element to the top by default
     * the offset calculates the screen height and the navbar height.
     */
    this.pickers[this.notSelectedPickerId].domElement.scrollIntoView({
      behavior: 'smooth',
      yOffset: -(window.innerHeight / 2) + 60,
    });

    /**
     * After scrolling is done the missing variant picker should highlight.
     */
    setTimeout(() => {
      this.setState({
        highlightedPickerId: this.notSelectedPickerId,
      });

      /**
       * We want to remove the highlighting after the animation is done, so start a timer here.
       */
      setTimeout(() => {
        this.setState({
          highlightedPickerId: null,
        });
      }, HIGHLIGHT_PICKER_DURATION);
    }, SCROLL_TO_PICKER_TIME);
  };

  /**
   * Creates a Picker for a selection entry
   * @param {Object} item Selection entry
   * @param {boolean} highlighted whether the given picker is highlighted.
   * @returns {JSX}
   */
  createPicker(item, highlighted) {
    const items = item.values.map(value => createPickerItem(value));

    let duration = VariantSelects.durationPerElement * items.length;

    if (duration > VariantSelects.maxDuration) {
      duration = VariantSelects.maxDuration;
    } else if (duration < VariantSelects.minDuration) {
      duration = VariantSelects.minDuration;
    }

    const buttonProps = {
      highlighted,
    };

    return (
      <Picker
        buttonComponent={VariantPickerButton}
        buttonProps={buttonProps}
        items={items}
        value={item.value}
        placeholder={
          <I18n.Text string="product.pick_an_attribute" params={[item.label]} />
        }
        label={item.label}
        onClose={this.handleOnClose}
        onChange={value => this.handleOnChange(item.id, value)}
        key={item.id}
        disabled={item.disabled}
        duration={duration}
        ref={(element) => { this.pickers[item.id] = element; }}
        isOpen={this.state.openPickerId === item.id}
      />
    );
  }

  /**
   * Create all Picker
   * @param {Array} selection Selection
   * @return {Array} Array with all created pickers
   */
  createPickers(selection) {
    this.notSelectedPickerId = null;
    this.pickers = {};

    return selection.map((item) => {
      // Store the first picker that is not selected
      if (item.value === null && this.notSelectedPickerId === null) {
        this.notSelectedPickerId = item.id;
      }

      const isHighlighted = this.state.highlightedPickerId === item.id;

      return this.createPicker(item, isHighlighted);
    });
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { selection } = this.props;

    if (!selection) {
      return null;
    }

    return (
      <div>
        <RouteGuard>
          {this.createPickers(selection)}
        </RouteGuard>
      </div>
    );
  }
}

export default connect(ProductVariants(VariantSelects));
// This export is only used by the test. we need it to test the component itself without the HOC
export { VariantSelects as Unwrapped };
