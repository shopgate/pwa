import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import { Ripple } from '@shopgate/engage/components';
import { useRadioGroup } from '../RadioGroup';

const useStyles = makeStyles()({
  root: {
    display: 'inline-flex',
    alignItems: 'inherit',
    justifyContent: 'inherit',
    position: 'relative',
    borderRadius: '50%',
  },
  input: {
    top: 0,
    left: 0,
    margin: 0,
    opacity: 0,
    padding: 0,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  radioContainer: {
    display: 'flex',
    position: 'relative',
    width: 24,
    height: 24,
  },
  radio: {
    height: '100%',
    width: '100%',
  },
  radioChecked: {
    color: 'var(--color-primary)',
  },
  radioDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  ripple: {
    padding: 12,
  },
});

/**
 * The Radio component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Radio = ({
  classes: classNamesProp,
  name: nameProp,
  onChange: onChangeProp,
  checked: checkedProp,
  disabled: disabledProp,
  value: valueProp,
  attributes,
}) => {
  const { classes } = useStyles();
  const radioGroup = useRadioGroup();

  let name = nameProp;
  let checked = checkedProp;
  let onChange = onChangeProp;

  if (radioGroup) {
    if (checked === null) {
      checked = radioGroup.value === valueProp;
    }

    if (typeof radioGroup.name !== 'undefined') {
      ({ name } = radioGroup);
    }

    if (typeof radioGroup.onChange !== 'undefined') {
      ({ onChange } = radioGroup);
    }
  }

  return (
    <span className={classNames(classes.root, classNamesProp.root)}>
      <Ripple className={classes.ripple} color="var(--color-primary)">
        <input
          className={classes.input}
          type="radio"
          name={name}
          value={valueProp}
          checked={checked}
          onChange={onChange}
          disabled={disabledProp}
          id={`${name}_${valueProp}`}
          {...attributes}
        />
        <div className={classNames(
          classes.radioContainer,
          {
            [classes.radioDisabled]: disabledProp,
            [classNamesProp.disabled]: disabledProp,
          }
        )}
        >
          {checked && (
            <CheckedIcon className={classNames(
              classes.radio,
              classes.radioChecked,
              classNamesProp.radioChecked,
              'checkedIcon'
            )}
            />
          )}
          {!checked && (
            <UncheckedIcon className={classNames(classes.radio, classNamesProp.radioUnchecked, 'uncheckedIcon')} />
          )}
        </div>
      </Ripple>
    </span>
  );
};

Radio.propTypes = {
  attributes: PropTypes.shape(),
  checked: PropTypes.bool,
  classes: PropTypes.shape(),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

Radio.defaultProps = {
  classes: {},
  checked: null,
  disabled: false,
  onChange: null,
  name: null,
  value: null,
  attributes: null,
};

export default Radio;
