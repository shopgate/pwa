import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '../../RadioGroup';
import RadioItem from '../../RadioGroup/components/Item';
import { ELEMENT_TYPE_RADIO } from './../elementTypes';

/**
 * React component that takes the element and additional data and renders a radio group
 * with a list of radio items.
 * @returns {JSX}
 */
class RadioElement extends PureComponent {
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
    value: '',
    visible: false,
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
      visible,
    } = this.props;

    // Don't render element if type doesn't match or if the element is not visible
    if (element.type !== ELEMENT_TYPE_RADIO || !visible) {
      return null;
    }

    return (
      <RadioGroup
        name={name}
        className={style.fields}
        label={element.label}
        value={value}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
      >
        {Object.keys(element.options).map(itemName => (
          <RadioItem
            key={itemName}
            name={itemName}
            label={element.options[itemName]}
          />
        ))}
      </RadioGroup>
    );
  }
}

export default RadioElement;
