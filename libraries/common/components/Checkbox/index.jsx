import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * @typedef {Object} CheckboxProps
 * @property {React.ReactNode} checkedIcon React component used as icon for the checked state
 * @property {React.ReactNode} uncheckedIcon React component used as icon for the unchecked state
 * @property {boolean} [checked] Current checked state of the checkbox
 * @property {string} [className] Class name for the checkbox
 * @property {boolean} [defaultChecked] Whether the checkbox is checked by default
 * @property {boolean} [disabled] Disabled state of the checkbox (default `false`)
 * @property {React.ReactNode | string} [label] Checkbox label. Can be a string or a component.
 * @property {"left"|"right"} [labelPosition] Position for the lable (default `"left"`)
 * @property {string} [name] Name for the hidden input tag
 * @property {Function} [onCheck] Callback invoked when checkbox is toggled
 */

/**
 * Base checkbox component.
 * @extends {React.Component<CheckboxProps>}
 * @returns {JSX.Element}
 */
class Checkbox extends Component {
  static propTypes = {
    checkedIcon: PropTypes.node.isRequired,
    uncheckedIcon: PropTypes.node.isRequired,
    checked: PropTypes.bool,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    labelPosition: PropTypes.oneOf(['left', 'right']),
    name: PropTypes.string,
    onCheck: PropTypes.func,
  };

  static defaultProps = {
    checked: undefined,
    className: undefined,
    defaultChecked: undefined,
    disabled: false,
    label: null,
    labelPosition: 'left',
    name: undefined,
    onCheck: () => {},
  };

  /**
   * The checkbox component constructor.
   * It checks if the checkbox is a controlled or uncontrolled input and sets an internal state if
   * uncontrolled to keep track of th checked-state.
   * @param {Object} props The Checkbox properties.
   */
  constructor(props) {
    super(props);

    if (typeof props.defaultChecked !== 'undefined') {
      // Uncontrolled input.
      this.state = { checked: props.defaultChecked };
    } else {
      // Controlled input
      this.state = { checked: props.checked };
    }
  }

  /**
   * Make sure state is updated with new checked value when input is controlled
   * @param {Object} nextProps Contains the new "checked" status
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Update only for controlled input
    if (typeof this.props.defaultChecked === 'undefined') {
      if (this.state.checked !== nextProps.checked) {
        this.setState({ checked: nextProps.checked });
      }
    }
  }

  /**
   * Returns if the checkbox is checked or not.
   * @return {boolean} Is the checkbox checked?
   */
  isChecked = () => (
    typeof this.props.defaultChecked === 'undefined'
      ? this.props.checked // Controlled.
      : this.state.checked // Uncontrolled.
  );

  /**
   * Inverts the current "checked" value and calls the callback function with it.
   * If the checkbox is uncontrolled, it keeps track of the value.
   */
  handleCheck = () => {
    if (this.props.disabled) {
      return;
    }

    const checked = !this.isChecked();

    if (typeof this.props.defaultChecked !== 'undefined') {
      // Uncontrolled.
      this.setState({ checked });
    }

    this.props.onCheck(checked);
  };

  /**
   * Handler for keyDown events of the checkbox
   * @param {Object} e The keyDown event payload
   */
  handleKeyDown = (e) => {
    if (e.key === ' ') {
      // Toggle checkbox on "space" - mocks behavior of native checkboxes
      this.handleCheck();
    }
  }

  /**
   * Renders the checked/unchecked icon.
   * @returns {JSX}
   */
  renderIcon = () => (
    this.isChecked()
      ? this.props.checkedIcon
      : this.props.uncheckedIcon
  );

  /**
   * Renders an input if a "name" prop is provided.
   * @returns {JSX}
   */
  renderInput = () => {
    const { props: { name }, isChecked } = this;
    return (
      this.props.name
        ? <input className="input" type="hidden" name={name} value={isChecked() ? 1 : 0} />
        : null
    );
  };

  /**
   * Renders the label if "side" matches he labelPosition prop.
   * @param {string} side Used to check against which side to render the label on.
   * @returns {JSX}
   */
  renderLabelIfItIsOnThe = side => (
    this.props.labelPosition === side
      ? this.props.label
      : null
  );

  /**
   * Renders the checkbox component.
   * @returns {JSX}
   */
  render() {
    return (
      <div
        className={classNames(this.props.className, 'checkbox')}
        onClick={this.handleCheck}
        onKeyDown={this.handleKeyDown}
        role="checkbox"
        aria-checked={this.props.checked}
        tabIndex={0}
      >
        {this.renderInput()}
        {this.renderLabelIfItIsOnThe('left')}
        {this.renderIcon()}
        {this.renderLabelIfItIsOnThe('right')}
      </div>
    );
  }
}

export default Checkbox;
