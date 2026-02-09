import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import QuantityInput from '@shopgate/engage/components/QuantityInput';
import { inputStyle } from './CartItemQuantityPicker.style';

/**
 * @typedef {Object} Props
 * @property {boolean} [editMode]
 * @property {function(number):void} [onChange]
 * @property {function(boolean):void} [onToggleEditMode]
 * @property {number} [quantity]
 * @property {string} [unit]
 * @property {boolean} [disabled]
 * @property {boolean} [hasCatchWeight]
 */

/**
 * The Quantity Picker component.
 */
export class CartItemQuantityPicker extends React.Component {
  /**
   * @type {Props}
   */
  static propTypes = {
    disabled: PropTypes.bool,
    editMode: PropTypes.bool,
    hasCatchWeight: PropTypes.bool,
    onChange: PropTypes.func,
    onToggleEditMode: PropTypes.func,
    quantity: PropTypes.number,
    unit: PropTypes.string,
  };

  static defaultProps = {
    editMode: false,
    onChange: () => {},
    unit: null,
    quantity: 1,
    onToggleEditMode: () => {},
    disabled: false,
    hasCatchWeight: false,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  /**
   * Called after mount. Focuses the input if the edit mode is active.
   */
  componentDidMount() {
    if (this.props.editMode && this.input.current) {
      this.input.current.focus();
    }

    if (this.input.current) {
      this.input.current.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      });
    }
  }

  /**
   * The componentWillReceiveProps lifecycle hook. I will bring the input into the correct state.
   * @param {Object} nextProps The next set of props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.input.current) {
      if (nextProps.editMode) {
        this.input.current.focus();
      } else {
        this.input.current.blur();
      }
    }
  }

  input;

  /**
   * Handles the input click event.
   * @param {Event} event The click event.
   */
  handleInputClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (this.props.onToggleEditMode) {
      this.props.onToggleEditMode(true);
    }
  };

  handleInputFocus = () => {
    if (this.props.onToggleEditMode) {
      this.props.onToggleEditMode(true);
    }
  };

  /**
   * Handles the form submission event.
   * @param {Event} event The submit event.
   */
  handleSubmitForm = (event) => {
    event.preventDefault();
    if (this.input.current) {
      this.input.current.blur();
    }
  };

  /**
   * Handles the input blur event.
   * @param {Event} event The blur event.
   * @param {number} newQuantity The new quantity value.
   */
  handleInputBlur = (event, newQuantity) => {
    const { onChange } = this.props;

    if (this.props.onToggleEditMode) {
      this.props.onToggleEditMode(false);
    }

    if (this.props.quantity !== newQuantity) {
      if (onChange) {
        onChange(newQuantity);
      }
    }
  };

  /**
   * Renders the component.
   * @return {JSX.Element}
   */
  render() {
    const { unit, hasCatchWeight } = this.props;
    const hasCustomUnit = (unit && hasCatchWeight) || false;

    return (
      <form onSubmit={this.handleSubmitForm} className="theme__cart__product__quantity-picker">
        <QuantityInput
          ref={this.input}
          className={inputStyle.toString()}
          value={this.props.quantity}
          onClick={this.handleInputClick}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          unit={hasCustomUnit ? unit : null}
          maxDecimals={hasCustomUnit ? 2 : 0}
          data-test-id="quantityPicker"
          disabled={this.props.disabled}
          aria-label={i18n.text('product.quantity')}
        />
      </form>
    );
  }
}
