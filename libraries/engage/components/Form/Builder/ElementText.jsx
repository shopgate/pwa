import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import {
  ELEMENT_TYPE_TEXT,
  ELEMENT_TYPE_NUMBER,
  ELEMENT_TYPE_EMAIL,
  ELEMENT_TYPE_PASSWORD,
  ELEMENT_TYPE_DATE,
  ELEMENT_TYPE_PHONE,
} from '../elementTypes';

// Map element type to input type
const mapping = {
  [ELEMENT_TYPE_TEXT]: 'text',
  [ELEMENT_TYPE_NUMBER]: 'number',
  [ELEMENT_TYPE_EMAIL]: 'email',
  [ELEMENT_TYPE_PASSWORD]: 'password',
  [ELEMENT_TYPE_DATE]: 'date',
  [ELEMENT_TYPE_PHONE]: 'tel',
};

/**
 * React component that takes the element and additional data and renders a configured text input.
 */
class TextElement extends PureComponent {
  static propTypes = {
    element: PropTypes.shape().isRequired,
    errorText: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.shape(),
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.bool.isRequired,
      PropTypes.number.isRequired,
    ]),
  };

  static defaultProps = {
    value: '',
    style: { field: '' },
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      element,
      errorText,
      name,
      style,
      value,
    } = this.props;

    const type = mapping[element.type];

    return (
      <TextField
        type={type}
        name={name}
        className={style.fields}
        label={element.label}
        value={value}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
      />
    );
  }
}

export default TextElement;
