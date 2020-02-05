import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * RadioItem component.
 */
class RadioItem extends PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]).isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    className: '',
    onChange: () => { },
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      label: ItemLabel, name, onChange, checked, className,
    } = this.props;

    return (
      <label className={classNames(style.container, className)} htmlFor={this.key}>
        {checked && <CheckedIcon className={`${style.active} ${style.icon}`} />}
        {!checked && <UncheckedIcon className={style.icon} />}

        <input
          className={style.input}
          checked={checked}
          type="radio"
          id={this.key}
          name={name}
          onChange={onChange}
        />
        <I18n.Text className={style.label} string={ItemLabel} />
      </label>
    );
  }
}

export default RadioItem;
