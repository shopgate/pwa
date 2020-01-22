import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import { withForwardedRef } from '../../core';
import PickerModal from './components/Modal';
import PickerButton from './components/Button';
import PickerList from './components/List';

/**
 * Converts an item of any type (e.g. string or number)
 * to an object representation containing value and label properties.
 * @param {*} item - An item of any type.
 * @returns {Object} An object representation of the item.
 */
const normalizeItem = (item) => {
  if (item !== null && typeof item !== 'undefined') {
    const itemDefaults = {
      value: item.value || item,
      label: item.label || item.value || item,
      disabled: item.disabled || false,
    };

    if (typeof item === 'object') {
      return {
        ...itemDefaults,
        ...item,
      };
    }

    return itemDefaults;
  }

  return null;
};

/**
 * Finds an item index in a list of items by value.
 * @param {Array} items - The list of items.
 * @param {*} value - The value to look for.
 * @returns {number} The found item index or undefined.
 */
const findItemIndexByValue = (items, value) => (
  items.map(normalizeItem).findIndex(item => item.value === value)
);

/**
 * The picker component (acts like a selectbox).
 */
class Picker extends Component {
  static propTypes = {
    buttonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    buttonProps: PropTypes.shape(),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    duration: PropTypes.number,
    forwardedRef: PropTypes.shape(),
    isOpen: PropTypes.bool,
    items: PropTypes.arrayOf((
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ])
    )),
    label: PropTypes.string,
    listComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    modalComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    placeholder: PropTypes.node,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    buttonComponent: PickerButton,
    buttonProps: {},
    duration: 300,
    disabled: false,
    forwardedRef: null,
    label: '',
    listComponent: PickerList,
    modalComponent: PickerModal,
    className: '',
    isOpen: false,
    items: [],
    onChange: () => { },
    onClose: () => { },
    onSelect: () => { },
    placeholder: 'Pick ...',
    value: null,
  };

  /**
   * The constructor.
   * @param {Object} props - The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: findItemIndexByValue(props.items, props.value),
      isOpen: props.isOpen,
    };
  }

  /**
   * Updates the selected item when the value prop changes.
   * @param {Object} nextProps - The next props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Only update if a value is present and also changed.
    if (
      !this.selectedItem ||
      nextProps.value !== this.selectedItem.value
    ) {
      this.setState({
        selectedIndex: findItemIndexByValue(nextProps.items, nextProps.value),
      });
    }

    if (this.props.isOpen !== nextProps.isOpen && nextProps.isOpen !== this.state.isOpen) {
      this.setState({
        isOpen: nextProps.isOpen,
      });
    }
  }

  /**
   * Getter for the selected item.
   */
  get selectedItem() {
    return normalizeItem(this.props.items[this.state.selectedIndex]);
  }

  /**
   * Triggers the onChange callback if the selected value has changed.
   * @param {Object} nextValue - The value the user picked.
   */
  triggerChangeCallback = (nextValue) => {
    const nextSelectedIndex = findItemIndexByValue(this.props.items, nextValue);
    if (
      nextSelectedIndex > -1 &&
      this.state.selectedIndex !== nextSelectedIndex
    ) {
      this.props.onChange(nextValue);
    }
    this.props.onSelect(nextValue);
  };

  /**
   * Triggers the onChange callback if the selected value has changed.
   * @param {Object} nextOpenState - The value the user picked.
   */
  triggerCloseCallback = (nextOpenState) => {
    if (this.state.isOpen && !nextOpenState) {
      this.props.onClose();
    }
  };

  /**
   * Gets called when a new item is selected
   * @param {string} value - The selected value.
   */
  handleItemSelect = (value) => {
    this.triggerChangeCallback(value);
    this.setState({
      selectedIndex: findItemIndexByValue(this.props.items, value),
    });
  };

  /**
   * Sets or toggles the open state of the component.
   * @param {boolean} [open] New open state.
   */
  toggleOpenState = (open) => {
    this.setState(({ isOpen }) => {
      const nextIsOpen = typeof open === 'boolean' ? open : !isOpen;
      this.triggerCloseCallback(nextIsOpen);

      return {
        isOpen: nextIsOpen,
      };
    });
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const hasSelection = !!this.selectedItem;

    const buttonValue = hasSelection
      ? this.selectedItem.label
      : '';
    const buttonLabel = hasSelection
      ? this.props.label
      : this.props.placeholder;

    const buttonProps = {
      ...this.props.buttonProps,
      label: buttonLabel,
      value: buttonValue,
      disabled: this.props.disabled,
      openList: this.props.disabled
        ? null
        : () => { this.toggleOpenState(true); },
    };

    const modalProps = {
      isOpen: this.state.isOpen,
      duration: this.props.duration,
      onClose: () => this.toggleOpenState(false),
    };

    const listProps = {
      items: this.props.items.map(normalizeItem),
      selectedIndex: this.state.selectedIndex,
      onSelect: this.handleItemSelect,
    };

    return (
      <div
        role="button"
        className={this.props.className}
        ref={this.props.forwardedRef}
        tabIndex={0}
        aria-haspopup
      >
        {React.createElement(this.props.buttonComponent, buttonProps)}
        <Portal onClose={() => this.toggleOpenState(false)} isOpened>
          {React.createElement(
            this.props.modalComponent,
            modalProps,
            React.createElement(this.props.listComponent, listProps)
          )}
        </Portal>
      </div>
    );
  }
}

export default withForwardedRef(Picker);
