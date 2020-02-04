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
    className: PropTypes.string,
    defaultChecked: PropTypes.bool,
    errorText: PropTypes.node,
    label: PropTypes.node,
    onChange: PropTypes.func,
    translateErrorText: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    defaultChecked: undefined,
    errorText: '',
    label: '',
    onChange: () => {},
    translateErrorText: true,
  };

  /**
   * @return {JSX}
   */
  render() {
    const {
      name, label, onChange, className, errorText, translateErrorText, ...restProps
    } = this.props;
    return (
      <FormElement
        className={`${className} ${style.root}`}
        htmlFor={name}
        errorText={errorText}
        translateErrorText={translateErrorText}
        hasUnderline={false}
        hasPlaceholder={false}
      >
        <UICheckbox
          {...restProps}
          name={name}
          onCheck={onChange}
          checkedClassName={`${className} ${style.checked}`}
          unCheckedClassName={className}
          labelPosition="right"
          label={
            <div className={classNames(style.labelWrapper, 'label')}>
              <I18n.Text className={style.label} string={label} />
            </div>
          }
        />
      </FormElement>
    );
  }
}

export default Checkbox;
