// @flow
import * as React from 'react';
import { i18n } from '@shopgate/engage/core';
import { PRODUCT_UNIT_EACH } from '@shopgate/engage/product/constants';
import { QuantityInput } from '@shopgate/engage/components';
import { inputStyle } from './CartItemQuantityPicker.style';

type Props = {
  editMode?: boolean,
  onChange?: (quantity: number) => void,
  onToggleEditMode?: (editMode: boolean) => void,
  quantity?: number,
  unit?: string,
  disabled?: boolean
}

/**
 * The Quantity Picker component.
 */
export class CartItemQuantityPicker extends React.Component<Props> {
  static defaultProps = {
    editMode: false,
    onChange: () => { },
    unit: null,
    quantity: 1,
    onToggleEditMode: () => { },
    disabled: false,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props: Props) {
    super(props);

    this.regex = /^([0-9.,]+)$/;
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
      /**
       * Prevent the opening of the context menu when this
       * input is focused and the value is selected.
       */
      this.input.current.addEventListener('contextmenu', (event: MouseEvent) => {
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
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.input.current) {
      if (nextProps.editMode) {
        this.input.current.focus();
      } else {
        this.input.current.blur();
      }
    }
  }

  regex: RegExp;

  input: {|
    current: any,
  |};

  /**
   * The default quantity.
   * @type {number}
   */
  defaultQuantity = 1;

  /**
   * Returns the initial quantity based on the props.
   * If the props are set to 0 or lower, it will fall back to 1.
   * @return {number}
   */
  get initialQuantity() {
    if (
      this.props.quantity
      && (this.props.quantity === 0 || this.props.quantity < this.defaultQuantity)
    ) {
      return this.defaultQuantity;
    }

    return this.props.quantity || this.defaultQuantity;
  }

  /**
   * Event handler for the the onClick event of the input.
   * @param {Object} event The event object.
   */
  handleInputClick = (event: SyntheticInputEvent<HTMLInputElement>) => {
    // Prevent the native focus event ...
    event.stopPropagation();
    event.preventDefault();

    // ... and trigger it manually.
    // This way we avoid the select actions (copy, paste, cut) to become visible.
    if (this.input.current) {
      this.input.current.blur();
    }

    if (this.props.onToggleEditMode) {
      this.props.onToggleEditMode(true);
    }
  };

  /**
   * Event handler for the the onFocus event of the input.
   */
  handleInputFocus = () => {
    if (this.input.current) {
      this.input.current.select();
    }

    if (this.props.onToggleEditMode) {
      this.props.onToggleEditMode(true);
    }
  };

  /**
   * Event handler for the onSubmit event of the form which wraps the input.
   * @param {Object} event The event object.
   */
  handleSubmitForm = (event: SyntheticInputEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (this.input.current) {
      this.input.current.blur();
    }
  };

  /**
   * Event handler for the the onBlur event of the input.
   * @param {Object} event The event object.
   * @param {number} newQuantity The event object.
   */
  handleInputBlur = (event: any, newQuantity: number) => {
    const { onChange } = this.props;

    // Deactivate the edit mode
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
   * @return {JSX}
   */
  render() {
    const { unit } = this.props;
    const hasCustomUnit = unit && unit !== PRODUCT_UNIT_EACH;

    return (
      <form onSubmit={this.handleSubmitForm}>
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
