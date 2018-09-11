import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../Checkbox';
import { ELEMENT_TYPE_CHECKBOX } from '../elementTypes';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} element The data of the element to be rendered
 * @returns {JSX}
 */
class CheckboxElement extends PureComponent {
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
    visible: PropTypes.bool,
  };

  static defaultProps = {
    value: false,
    visible: false,
    style: { fields: '' },
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      element,
      style,
      errorText,
      visible,
      value,
      name,
    } = this.props;

    // Don't render element if type doesn't match or if the element is not visible
    if (element.type !== ELEMENT_TYPE_CHECKBOX || !visible) {
      return null;
    }

    return (
      <Checkbox
        name={name}
        errorText={errorText}
        checked={value}
        className={style.fields}
        label={element.label}
        onChange={element.handleChange}
      />
    );
  }
}

export default CheckboxElement;
