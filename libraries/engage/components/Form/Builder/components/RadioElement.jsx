import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@shopgate/pwa-ui-shared/Form/RadioGroup';
import RadioItem from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item';

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
