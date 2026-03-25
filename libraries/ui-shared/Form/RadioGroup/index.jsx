import React, {
  Children, cloneElement, useCallback, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((_t, { direction }) => ({
  container: {
    display: 'flex',
    flexDirection: direction,
  },
}));

/**
 * Radio group: clones children (radio items) with shared `name`, `checked`, and `onChange`.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const RadioGroup = ({
  name,
  children,
  className,
  direction,
  disabled,
  errorText,
  isControlled,
  label,
  onChange,
  showErrorText,
  translateErrorText,
  value: valueProp,
}) => {
  const { classes, cx } = useStyles({ direction });
  const [selectedValue, setSelectedValue] = useState(valueProp);

  useEffect(() => {
    if (isControlled) {
      setSelectedValue(valueProp);
    }
  }, [isControlled, valueProp]);

  /**
   * @param {{ target: { name: string } }} event Change event from a radio input.
   */
  const handleItemChange = useCallback(({ target: { name: itemName } }) => {
    if (disabled) {
      return;
    }
    if (!isControlled) {
      setSelectedValue(itemName);
    }
    onChange(itemName);
  }, [disabled, isControlled, onChange]);

  return (
    <FormElement
      className={classNames(className, 'radioGroup', 'ui-shared__form__radio-group', {
        disabled,
      })}
      label={label}
      labelStatic
      errorText={errorText}
      translateErrorText={translateErrorText}
      showErrorText={showErrorText}
      htmlFor="none"
      hasUnderline={false}
      hasValue
    >
      <div className={cx(classes.container, 'radioGroup')}>
        {Children.map(children, (child) => {
          if (!child) {
            return null;
          }

          return cloneElement(child, {
            key: `${name}_${child.props.name}`,
            checked: selectedValue === child.props.name,
            onChange: handleItemChange,
          });
        })}
      </div>
    </FormElement>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  direction: PropTypes.string,
  disabled: PropTypes.bool,
  errorText: PropTypes.string,
  isControlled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  showErrorText: PropTypes.bool,
  translateErrorText: PropTypes.bool,
  value: PropTypes.string,
};

RadioGroup.defaultProps = {
  onChange: () => { },
  children: null,
  className: '',
  direction: 'column',
  disabled: false,
  errorText: '',
  isControlled: false,
  label: '',
  translateErrorText: true,
  value: null,
  showErrorText: true,
};

export default RadioGroup;
