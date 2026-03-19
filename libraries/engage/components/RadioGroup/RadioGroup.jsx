import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import RadioGroupContext from './RadioGroup.context';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RadioGroup = ({
  classes: classNamesProp,
  children,
  name,
  disabled,
  value: valueProp,
  defaultValue,
  onChange,
  component: Component,
}) => {
  const { classes } = useStyles();
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

  const contextValue = useMemo(() => ({
    name,
    onChange: handleChange,
    value,
    disabled,
  }), [disabled, handleChange, name, value]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <Component role="radiogroup" className={classNames(classes.root, classNamesProp.root)}>
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

export default RadioGroup;
