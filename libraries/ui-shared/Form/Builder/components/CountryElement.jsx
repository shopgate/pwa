import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from '../../Select';
import { ELEMENT_TYPE_COUNTRY } from './../elementTypes';

/**
 * React component that takes the element and additional data and renders a select box
 * with a list of countries to select from.
 * @returns {JSX}
 */
class CountryElement extends PureComponent {
  static propTypes = {
    element: PropTypes.shape().isRequired,
    errorText: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    countryList: PropTypes.shape(),
    style: PropTypes.shape(),
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.bool.isRequired,
      PropTypes.number.isRequired,
    ]),
    visible: PropTypes.bool,
  };

  static defaultProps = {
    countryList: {},
    value: '',
    visible: false,
    style: { fields: '' },
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      countryList,
      element,
      errorText,
      name,
      style,
      value,
      visible,
    } = this.props;

    // Don't render element if type doesn't match or if the element is not visible
    if (element.type !== ELEMENT_TYPE_COUNTRY || !visible) {
      return null;
    }

    return (
      <Select
        name={name}
        className={style.fields}
        label={element.label}
        placeholder={element.placeholder}
        value={value}
        options={countryList}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
      />
    );
  }
}

export default CountryElement;
