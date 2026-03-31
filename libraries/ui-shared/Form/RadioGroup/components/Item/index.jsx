import React from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import { I18n, CheckedIcon, UncheckedIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
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
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  active: {
    color: 'var(--color-primary)',
  },
}));

/**
 * RadioItem component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const RadioItem = ({
  label: ItemLabel, name, onChange, checked, className, attributes, id,
}) => {
  const { classes, cx } = useStyles();
  const { disabled } = attributes || {};

  return (
    <label
      className={cx(
        classes.container, className, { [classes.disabled]: !!disabled }, camelCase(name), 'radioItem'
      )}
      htmlFor={id || name}
    >
      {checked && (
        <CheckedIcon
          className={cx(classes.active, classes.icon, 'checkedIcon')}
        />
      )}
      {!checked && (
        <UncheckedIcon
          className={cx(classes.icon, 'uncheckedIcon')}
        />
      )}
      <input
        className={cx('sr-only', 'input')}
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
        className={cx(classes.label, 'label')}
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
