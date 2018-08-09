import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import UICheckbox from '@shopgate/pwa-ui-shared/Checkbox';
import style from './style';

/**
 * A component that provides a styled checkbox for user input in material design.
 */
class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    errorText: PropTypes.node,
    label: PropTypes.node,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    errorText: '',
    label: '',
    onChange: () => {},
  };

  /**
   * @return {JSX}
   */
  render() {
    const {
      name, label, onChange, className,
    } = this.props;
    return (
      <FormElement
        className={className}
        htmlFor={name}
        errorText={this.props.errorText}
        hasUnderline={false}
        hasPlaceholder={false}
      >
        <UICheckbox
          defaultChecked
          name={name}
          onCheck={onChange}
          checkedClassName={className}
          unCheckedClassName={className}
          labelPosition="right"
          label={
            <I18n.Text className={style.label} string={label} />
          }
        />
      </FormElement>
    );
  }
}

export default Checkbox;
