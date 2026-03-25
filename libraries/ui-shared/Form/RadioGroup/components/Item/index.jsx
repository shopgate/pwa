import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import { I18n, CheckedIcon, UncheckedIcon } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  container: {
    display: 'flex',
    marginLeft: -1,
  },
  icon: {
    width: 24,
    height: 24,
    flexShrink: 0,
  },
  disabled: {
    opacity: 0.25,
    pointerEvents: 'none',
  },
  label: {
    flex: 1,
    fontSize: '1rem',
    lineHeight: 1.5,
    marginLeft: themeConfig.variables.gap.small,
    marginBottom: themeConfig.variables.gap.small,
  },
  active: {
    color: 'var(--color-primary)',
  },
});

/**
 * RadioItem component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const RadioItem = ({
  label: ItemLabel, name, onChange, checked, className, attributes, id,
}) => {
  const { classes } = useStyles();
  const { disabled } = attributes || {};

  return (
    <label
      className={classNames(
        classes.container, className, { [classes.disabled]: !!disabled }, camelCase(name), 'radioItem'
      )}
      htmlFor={id || name}
    >
      {checked && (
        <CheckedIcon
          className={classNames(classes.active, classes.icon, 'checkedIcon')}
        />
      )}
      {!checked && (
        <UncheckedIcon
          className={classNames(classes.icon, 'uncheckedIcon')}
        />
      )}
      <input
        className={classNames('sr-only', 'input')}
        checked={checked}
        id={id || name}
        type="radio"
        name={name}
        onChange={onChange}
        aria-labelledby={`${id || name}-label`}
        {...attributes}
      />
      <I18n.Text
        string={ItemLabel}
        aria-hidden
        id={`${id || name}-label`}
        className={classNames(classes.label, 'label')}
      />
    </label>
  );
};

RadioItem.propTypes = {
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
  id: PropTypes.string,
  onChange: PropTypes.func,
};

RadioItem.defaultProps = {
  attributes: null,
  id: null,
  checked: false,
  className: '',
  onChange: () => { },
};

export default RadioItem;
