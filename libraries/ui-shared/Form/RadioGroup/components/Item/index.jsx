import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * RadioItem component.
 */
class RadioItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    onChange: () => {},
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      label, name, onChange, checked,
    } = this.props;

    return (
      <label className={style.container} htmlFor={this.key}>

        {checked && <CheckedIcon className={style.active} />}
        {!checked && <UncheckedIcon />}

        <input
          className={style.input}
          checked={checked}
          type="radio"
          id={this.key}
          name={name}
          onChange={onChange}
        />
        <I18n.Text className={style.label} string={label} />
      </label>
    );
  }
}

export default RadioItem;
