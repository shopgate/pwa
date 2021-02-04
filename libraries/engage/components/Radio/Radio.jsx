import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import CheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioCheckedIcon';
import UncheckedIcon from '@shopgate/pwa-ui-shared/icons/RadioUncheckedIcon';
import { Ripple } from '@shopgate/engage/components';
import { useRadioGroup } from '../RadioGroup';

const styles = {
  root: css({
    display: 'inline-flex',
    alignItems: 'inherit',
    justifyContent: 'inherit',
    position: 'relative',
    borderRadius: '50%',
  }).toString(),
  input: css({
    top: 0,
    left: 0,
    margin: 0,
    opacity: 0,
    padding: 0,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  }).toString(),
  checkboxContainer: css({
    display: 'flex',
    position: 'relative',
    width: 24,
    height: 24,
  }).toString(),
  checkbox: css({
    height: '100%',
    width: '100%',
  }).toString(),
  checkboxChecked: css({
    color: 'var(--color-primary)',
  }).toString(),
  checkboxDisabled: css({
    opacity: 0.25,
    pointerEvents: 'none',
  }).toString(),
  ripple: css({
    padding: 12,
  }).toString(),
};

/**
 * The Radio component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Radio = ({
  classes,
  name: nameProp,
  onChange: onChangeProp,
  checked: checkedProp,
  disabled: disabledProp,
  value: valueProp,
  attributes,
}) => {
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
    <span className={classNames(styles.root, classes.root)}>
      <Ripple className={styles.ripple} color="var(--color-primary)">
        <input
          className={styles.input}
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
          styles.checkboxContainer,
          { [styles.checkboxDisabled]: disabledProp }
        )}
        >
          {checked && (
            <CheckedIcon className={classNames(styles.checkbox, styles.checkboxChecked, 'checkedIcon')} />
          )}
          {!checked && (
            <UncheckedIcon className={classNames(styles.checkbox, 'uncheckedIcon')} />
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

export default hot(Radio);
