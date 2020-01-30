import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from '@shopgate/pwa-ui-shared/Form/Select';

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
  };

  static defaultProps = {
    provincesList: {},
    value: '',
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
    } = this.props;

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
