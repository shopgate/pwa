import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from '../../Select';
import { ELEMENT_TYPE_PROVINCE } from './../elementTypes';

/**
 * React component that takes the element and additional data and renders a select box
 * with a list of provinces to select from.
 * @returns {JSX}
 */
class ProvinceElement extends PureComponent {
  static propTypes = {
    element: PropTypes.shape().isRequired,
    errorText: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    provincesList: PropTypes.shape(),
    style: PropTypes.shape(),
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.bool.isRequired,
      PropTypes.number.isRequired,
    ]),
    visible: PropTypes.bool,
  };

  static defaultProps = {
    provincesList: {},
    value: '',
    visible: false,
    style: { fields: '' },
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      provincesList,
      element,
      errorText,
      name,
      style,
      value,
      visible,
    } = this.props;

    // Don't render element if type doesn't match or if the element is not visible
    if (element.type !== ELEMENT_TYPE_PROVINCE || !visible) {
      return null;
    }

    return (
      <Select
        name={name}
        className={style.fields}
        label={element.label}
        placeholder={element.placeholder}
        value={value}
        options={provincesList}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
      />
    );
  }
}

export default ProvinceElement;
