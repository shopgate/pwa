import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormContext } from '@shopgate/pwa-common/context';

/**
 * Form component that handles keyboard submit, next buttons, ...
 */
class Form extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: () => {},
  }

  static contextType = FormContext;

  /**
   * Initializes the form component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.formElement = React.createRef();
  }

  /**
   * Handles the form submit.
   * @param {Object} event The event that caused the submit.
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const inputFocused = [...this.formElement.current
      .querySelectorAll('input')]
      .some(input => document.activeElement === input);

    if (inputFocused) {
      document.activeElement.blur();
    }

    this.props.onSubmit();
  }

  /**
   * Handles form submits by key.
   * @param {Object} event The event that caused the keypress.
   */
  handleKeyPress = (event) => {
    // Enter key and on iOS also the "Done" button.
    if (event.which === 13) {
      this.handleSubmit(event);
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { form = {} } = this.context || {};

    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    return (
      <form
        action="#"
        className={form.className}
        onSubmit={this.handleSubmit}
        onKeyPress={this.handleKeyPress}
        ref={this.formElement}
      >
        {this.props.children}
      </form>
    );
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
  }
}

export default Form;
