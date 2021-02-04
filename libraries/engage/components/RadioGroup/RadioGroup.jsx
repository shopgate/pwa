import { hot } from 'react-hot-loader/root';
import React, { useState, useCallback } from 'react';
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
  classes, children, name, value: valueProp, defaultValue, onChange,
}) => {
  const [value, setValue] = useState(valueProp || defaultValue);

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
    }}
    >
      <div role="radiogroup" className={classNames(styles.root, classes.root)}>
        { children }
      </div>

    </RadioGroupContext.Provider>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  classes: PropTypes.shape(),
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

RadioGroup.defaultProps = {
  classes: {},
  children: null,
  defaultValue: null,
  value: null,
  onChange: null,
};

export default hot(RadioGroup);
