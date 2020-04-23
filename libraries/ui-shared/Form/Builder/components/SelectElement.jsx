import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Chevron from '../../../icons/CheckIcon';
import Select from '../../Select';

/**
 * React component that takes the element and additional data and renders a configured select box.
 * @returns {JSX}
 */
class SelectElement extends PureComponent {
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
    style: { fields: '' },
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

    return (
      <Fragment>
        <Select
          name={name}
          className={style.fields}
          label={element.label}
          placeholder={element.placeholder}
          value={value}
          options={element.options}
          onChange={element.handleChange}
          errorText={errorText}
          isControlled
          translateErrorText={false}
        />
        <Chevron />
      </Fragment>
    );
  }
}

export default SelectElement;
