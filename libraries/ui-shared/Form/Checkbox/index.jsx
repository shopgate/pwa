import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import UICheckbox from '@shopgate/pwa-ui-shared/Checkbox';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * @typedef {Object} Props
 * @property {string} label Label for the checkbox
 * @property {string} name Name for the form element that's used as "htmlFor" attribute to create
 * a connection between label and checkbox elements.
 * @property {string} [checkboxClassName] Class name for the underlying Checkbox component
 * @property {string} [className] Class name for the underlying FormElement component
 * @property {boolean} [defaultChecked] Whether the checkbox is checked by default
 * @property {boolean} [disabled] Whether the checkbox is disabled (default `false`)
 * @property {string} [errorText] An error text for the form element
 * @property {boolean} [showErrorText] Whether to show the error text when present (default `true`)
 * @property {boolean} [translateErrorText] Whether `errorText` is a translation key
 * @property {Function} [onChange] Change handler for the checkbox
 */

/**
 * A component that provides a styled checkbox field.
 * @extends {React.Component<Props>}
 * @returns {JSX.Element}
 */
class Checkbox extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    checkboxClassName: PropTypes.string,
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    errorText: PropTypes.node,
    label: PropTypes.node,
    onChange: PropTypes.func,
    showErrorText: PropTypes.bool,
    translateErrorText: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    checkboxClassName: undefined,
    defaultChecked: undefined,
    errorText: '',
    label: '',
    onChange: () => {},
    translateErrorText: true,
    disabled: false,
    showErrorText: true,
  };

  /**
   * @return {JSX}
   */
  render() {
    const {
      name,
      label,
      onChange,
      className,
      errorText,
      translateErrorText,
      showErrorText,
      checkboxClassName,
      ...restProps
    } = this.props;

    return (
      <FormElement
        className={classNames(className, style.root, 'checkbox', 'ui-shared__form__checkbox')}
        htmlFor={name}
        errorText={errorText}
        translateErrorText={translateErrorText}
        hasUnderline={false}
        hasPlaceholder={false}
        disabled={restProps.disabled}
        showErrorText={showErrorText}
      >
        <UICheckbox
          {...restProps}
          className={checkboxClassName}
          name={name}
          onCheck={onChange}
          checkedClassName={`${className} ${style.checked}`}
          unCheckedClassName={className}
          labelPosition="right"
          label={typeof label === 'string' ? (
            <div className={classNames(style.labelWrapper, 'label')}>
              <I18n.Text className={style.label} string={label} />
            </div>
          ) : label
          }
        />
      </FormElement>
    );
  }
}

export default Checkbox;
