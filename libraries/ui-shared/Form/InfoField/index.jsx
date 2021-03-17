import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import FormElement from '../../FormElement';
import style from './style';

/**
 * @param {Object} props .
 * @returns {JSX}
 */
const InfoField = (props) => {
  const {
    className, label, errorText, leftElement, rightElement,
    hasUnderline, children, hasValue,
  } = props;

  return (
    <FormElement
      className={className}
      label={label}
      errorText={errorText}
      hasUnderline={hasUnderline}
      isFocused={false}
      hasValue={hasValue}
    >
      <Grid>
        {leftElement && <Grid.Item grow={0} className={style.element}>{leftElement}</Grid.Item>}
        <Grid.Item grow={1} className={style.info}>
          {children}
        </Grid.Item>
        {rightElement && <Grid.Item grow={0} className={style.element}>{rightElement}</Grid.Item>}
      </Grid>
    </FormElement>
  );
};

InfoField.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  errorText: PropTypes.node,
  hasUnderline: PropTypes.bool,
  hasValue: PropTypes.bool,
  label: PropTypes.node,
  /** Element to place left of text input (leading icon) */
  leftElement: PropTypes.node,
  /** Element to place right of text input (trailing icon) */
  rightElement: PropTypes.node,
};

InfoField.defaultProps = {
  className: '',
  errorText: '',
  hasUnderline: true,
  hasValue: false,
  label: '',
  leftElement: null,
  rightElement: null,
};

export default InfoField;
