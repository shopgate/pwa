import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import UICheckbox from '@shopgate/pwa-ui-shared/Checkbox';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * A component that provides a styled checkbox field.
 * @returns {JSX}
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
        className={classNames(className, style.root, 'checkbox')}
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
