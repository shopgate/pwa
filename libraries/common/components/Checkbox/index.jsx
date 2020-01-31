import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormContext } from '@shopgate/pwa-common/context';

/**
 * Base checkbox component.
 * @type {Object}
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

  static contextType = FormContext;

  /**
   * The checkbox component contructor.
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
  renderInput = () => (
    this.props.name
      ? <input type="hidden" name={this.props.name} value={this.isChecked() ? 1 : 0} />
      : null
  );

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
    const { checkbox = {} } = this.context || {};

    return (
      <div
        className={classNames(this.props.className, checkbox.className)}
        onClick={this.handleCheck}
        aria-hidden
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
