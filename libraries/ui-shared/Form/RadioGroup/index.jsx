import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * RadioGroup component.
 */
class RadioGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    default: PropTypes.string,
    errorText: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
    children: null,
    errorText: '',
    label: '',
    default: null,
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = { active: props.default };
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      children, onChange, label, errorText,
    } = this.props;

    return (
      <FormElement
        label={label}
        errorText={errorText}
        htmlFor="none"
        hasUnderline={false}
        hasValue
      >
        <div className={style.container}>
          {Children.map(children, child => cloneElement(child, {
            active: this.state.active === child.props.name,
            onChange: () => {
              this.setState({ active: child.props.name });
              onChange(child.props.name);
            },
          }))}
        </div>
      </FormElement>
    );
  }
}

export default RadioGroup;
