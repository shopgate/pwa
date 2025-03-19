import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import { I18n, CheckedIcon, UncheckedIcon } from '@shopgate/engage/components';
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
    attributes: PropTypes.shape(),
    checked: PropTypes.bool,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    onChange: PropTypes.func,
  }

  static defaultProps = {
    attributes: null,
    checked: false,
    className: '',
    onChange: () => { },
  }

  /**
   * Renders the component.
   * @returns {JSX.Element}
   */
  render() {
    const {
      label: ItemLabel, name, onChange, checked, className, attributes,
    } = this.props;

    const { disabled } = attributes || {};

    return (
      <label
        className={classNames(
          style.container, className, { [style.disabled]: !!disabled }, camelCase(name), 'radioItem'
        )}
        htmlFor={name}
      >
        {checked && (
          <CheckedIcon
            className={classNames(style.active, style.icon, 'checkedIcon')}
          />
        )}
        {!checked && (
          <UncheckedIcon
            className={classNames(style.icon, 'uncheckedIcon')}
          />
        )}
        <input
          className={classNames('sr-only', 'input')}
          checked={checked}
          id={name}
          type="radio"
          name={name}
          onChange={onChange}
          aria-labelledby={`${name}-label`}
          {...attributes}
        />
        <I18n.Text
          string={ItemLabel}
          aria-hidden
          id={`${name}-label`}
          className={classNames(style.label, 'label')}
        />
      </label>
    );
  }
}

export default RadioItem;
