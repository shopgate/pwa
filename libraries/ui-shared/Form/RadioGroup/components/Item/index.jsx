import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { camelCase } from 'lodash';
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
      <label
        className={classNames(style.container, className, camelCase(name), 'radioItem')}
        htmlFor={this.key}
      >
        {checked && <CheckedIcon className={classNames(style.active, style.icon, 'checkedIcon')} />}
        {!checked && <UncheckedIcon className={classNames(style.icon, 'uncheckedIcon')} />}

        <input
          className={classNames(style.input, 'input')}
          checked={checked}
          type="radio"
          name={name}
          onChange={onChange}
        />
        <I18n.Text className={classNames(style.label, 'label')} string={ItemLabel} />
      </label>
    );
  }
}

export default RadioItem;
