import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import { makeStyles } from '@shopgate/engage/styles';
import FormElement from '../../FormElement';

const useStyles = makeStyles()({
  info: {
    paddingTop: 24,
  },
  element: {
    marginTop: 16,
  },
});

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const InfoField = (props) => {
  const {
    className, label, errorText, leftElement, rightElement,
    hasUnderline, children, hasValue, showErrorText,
  } = props;
  const { classes } = useStyles();

  return (
    <FormElement
      className={className}
      label={label}
      errorText={errorText}
      hasUnderline={hasUnderline}
      isFocused={false}
      hasValue={hasValue}
      showErrorText={showErrorText}
    >
      <Grid>
        {leftElement && <Grid.Item grow={0} className={classes.element}>{leftElement}</Grid.Item>}
        <Grid.Item grow={1} className={`${classes.info} info-field`}>
          {children}
        </Grid.Item>
        {rightElement && <Grid.Item grow={0} className={classes.element}>{rightElement}</Grid.Item>}
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
  leftElement: PropTypes.node,
  rightElement: PropTypes.node,
  showErrorText: PropTypes.bool,
};

InfoField.defaultProps = {
  className: '',
  errorText: '',
  hasUnderline: true,
  hasValue: false,
  label: '',
  leftElement: null,
  rightElement: null,
  showErrorText: true,
};

export default InfoField;
