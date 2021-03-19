import { hot } from 'react-hot-loader/root';
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import RadioGroupContext from './RadioGroup.context';

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RadioGroup = ({
  classes,
  children,
  name,
  disabled,
  value: valueProp,
  defaultValue,
  onChange,
  component: Component,
}) => {
  const [value, setValue] = useState(valueProp || defaultValue);

  useEffect(() => {
    setValue(valueProp || defaultValue);
  }, [defaultValue, valueProp]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);

    if (onChange) {
      onChange(event, event.target.value);
    }
  }, [onChange]);

  return (
    <RadioGroupContext.Provider value={{
      name,
      onChange: handleChange,
      value,
      disabled,
    }}
    >
      <Component role="radiogroup" className={classNames(styles.root, classes.root)}>
        { children }
      </Component>

    </RadioGroupContext.Provider>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  classes: PropTypes.shape(),
  component: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

RadioGroup.defaultProps = {
  classes: {},
  children: null,
  defaultValue: null,
  disabled: false,
  value: null,
  onChange: null,
  component: 'div',
};

export default hot(RadioGroup);
