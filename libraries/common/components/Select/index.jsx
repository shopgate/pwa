import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import SelectItem from './components/Item';

const DEFAULT_PLACEHOLDER_TEXT = 'Select ...';

/**
 * Finds an item in a list of items by value.
 * @param {Array} items - The list of items.
 * @param {*} value - The value to look for.
 * @returns {*} The found item or undefined.
 */
const findItemByValue = (items, value) => (
  items.filter(item => item.value === value).shift()
);

/**
 * Converts an item of any type (e.g. string or number)
 * to an object representation containing value and label properties.
 * @param {*} item - An item of any type.
 * @returns {Object} An object representation of the item.
 */
const normalizeItem = item => ({
  value: item.value || item,
  label: item.label || item.value || item,
});

/**
 * The select component.
 * @param {Object} props - The component props.
 * @param {React.Children} props.children - Some content to display inside.
 */
class Select extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf((
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
      ])
    )),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    className: '',
    items: [],
    onChange: () => {},
    placeholder: DEFAULT_PLACEHOLDER_TEXT,
    value: null,
  };

  /**
   * The constructor.
   * @param {Object} props - The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
      isOpen: false,
    };
    this.domElement = null;

    if (props.value) {
      this.state.selected = normalizeItem((
        findItemByValue(props.items, props.value)
      ));
    }
  }

  /**
   * Adds event listener when the component is mounted.
   */
  componentDidMount() {
    document.addEventListener('touchstart', this.handleInteractionOutside);
  }

  /**
   * Updates the selected item when the value prop changes.
   * @param {Object} nextProps - The next props.
   */
  componentWillReceiveProps(nextProps) {
    if (
      !this.state.selected ||
      nextProps.value !== this.state.selected.value
    ) {
      this.state.selected = normalizeItem((
        findItemByValue(nextProps.items, nextProps.value)
      ));
    }
  }

  /**
   * Removes event listener when the component will unmount.
   */
  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleInteractionOutside);
  }

  /**
   * Triggers the onChange callback if the selected value has changed.
   * @param {Object} nextState - The next state.
   */
  triggerChangeCallback = (nextState) => {
    if (
      this.state.selected &&
      this.state.selected.value === nextState.selected.value
    ) {
      return;
    }

    if (this.props.onChange instanceof Function) {
      this.props.onChange(nextState.selected.value);
    }
  };

  /**
   * Handles any interaction the user does outside of the component.
   * In this case the select gets closed.
   * @param {Event} event - The event of the user interaction (e.g. TouchEvent).
   */
  handleInteractionOutside = (event) => {
    if (!this.domElement.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  };

  /**
   * Gets called when a new item is selected
   * @param {*} value - The selected value.
   * @param {string} label - The selected label.
   */
  handleItemSelect = (value, label) => {
    const stateUpdate = {
      selected: {
        label,
        value,
      },
      isOpen: false,
    };
    this.triggerChangeCallback(stateUpdate);
    this.setState(stateUpdate);
  };

  /**
   * Toggles the open state of the component.
   */
  toggleOpenState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const hasSelection = this.state.selected && this.state.selected.value !== undefined;

    const selectedLabel = (hasSelection) ?
      this.state.selected.label : this.props.placeholder;

    const items = (this.state.isOpen) ? (
      <div className={styles.items}>
        {this.props.items.map((item) => {
          const normalizedItem = normalizeItem(item);
          const selected = hasSelection && this.state.selected.value === normalizedItem.value;

          return (
            <SelectItem
              key={normalizedItem.value}
              value={normalizedItem.value}
              label={normalizedItem.label}
              selected={selected}
              onSelect={this.handleItemSelect}
            />
          );
        })}
      </div>
    ) : null;

    return (
      <div className={`${styles.container} ${this.props.className}`} ref={(ref) => { this.domElement = ref; }}>
        <div onTouchStart={this.toggleOpenState}>
          <span>
            {selectedLabel}
          </span>
          <span className={styles.selectHandle}>
            &#9662;
          </span>
        </div>
        {items}
      </div>
    );
  }
}

export default Select;
