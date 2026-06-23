import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import BaseCheckbox from '@shopgate/pwa-common/components/Checkbox';
import CheckedIcon from '../icons/CheckedIcon';
import UncheckedIcon from '../icons/UncheckedIcon';

const useStyles = makeStyles()(() => ({
  icon: {
    width: 24,
    height: 24,
    flexShrink: 0,
  },
  checkedIcon: {
    color: 'var(--color-secondary)',
  },
  uncheckedIcon: {
    color: themeConfig.colors.shade6,
  },
}));

/**
 * The checkbox template component.
 * @param {Object} props The component props
 * @param {string} props.className Class for the underlying Checkbox component
 * @param {string} [props.checkedClassName] Extra class for checked icon; default: secondary color.
 * @param {string} [props.unCheckedClassName] Extra class for unchecked icon; default: shade6.
 * @returns {JSX.Element}
 */
const Checkbox = ({
  checkedClassName,
  unCheckedClassName,
  className,
  ...props
}) => {
  const { classes, cx } = useStyles();

  // Legacy default: theme classes for checked/unchecked unless props are passed.
  // `??` keeps an explicit '' from restoring defaults (like old cx(icon, '', …)).
  const checkedCls = checkedClassName ?? classes.checkedIcon;
  const uncheckedCls = unCheckedClassName ?? classes.uncheckedIcon;

  return (
    <BaseCheckbox
      {...props}
      className={cx('ui-shared__checkbox', className)}
      checkedIcon={
        <CheckedIcon className={cx(classes.icon, checkedCls, 'checkedIcon')} />
      }
      uncheckedIcon={
        <UncheckedIcon className={cx(classes.icon, uncheckedCls, 'uncheckedIcon')} />
      }
    />
  );
};

Checkbox.propTypes = {
  checkedClassName: PropTypes.string,
  className: PropTypes.string,
  unCheckedClassName: PropTypes.string,
};

Checkbox.defaultProps = {
  className: '',
  checkedClassName: undefined,
  unCheckedClassName: undefined,
};

export default Checkbox;
