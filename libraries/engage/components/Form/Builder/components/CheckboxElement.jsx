import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';

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
  };

  static defaultProps = {
    value: false,
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
      value,
      name,
    } = this.props;

    return (
      <Checkbox
        name={name}
        errorText={errorText}
        checked={value}
        className={style.fields}
        label={element.label}
        onChange={element.handleChange}
        translateErrorText={false}
      />
    );
  }
}

export default CheckboxElement;
