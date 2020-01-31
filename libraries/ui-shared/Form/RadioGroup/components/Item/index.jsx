import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormContext } from '@shopgate/pwa-common/context';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import style from './style';

/**
 * RadioItem component.
 * @param {Object} props Component props
 * @returns {JSX}
 */
const RadioItem = (props) => {
  const {
    id, label, name, onChange, checked,
  } = props;

  const { radio: { item = {} } = {} } = useContext(FormContext) || {};

  return (
    <label
      className={classNames(style.container, item.label && item.label.className)}
      htmlFor={id}
    >
      {checked &&
        <CheckedIcon
          className={classNames(
            style.active,
            style.icon,
            item.icon && item.icon.checked && item.icon.checked.className
          )}
        />
      }
      {!checked &&
        <UncheckedIcon
          className={classNames(
            style.icon,
            item.icon && item.icon.unchecked && item.icon.unchecked.className
          )}
        />
      }

      <input
        className={classNames(style.input, item.input && item.input.className)}
        checked={checked}
        type="radio"
        id={id}
        name={name}
        onChange={onChange}
      />
      <I18n.Text
        className={classNames(style.label, item.text && item.text.className)}
        string={label}
      />
    </label>
  );
};

RadioItem.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
};

RadioItem.defaultProps = {
  checked: false,
  id: null,
  onChange: () => {},
};

export default RadioItem;
