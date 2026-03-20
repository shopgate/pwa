import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  button: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 20px',
  },
  label: {
    display: 'block',
  },
  value: {
    display: 'block',
    fontWeight: 'bold',
  },
});

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const PickerButton = ({ value, label, openList }) => {
  const { classes } = useStyles();

  return (
    <button className={`${classes.button} engage__picker__button`} onClick={openList} type="button">
      <span className={classes.label}>{label}</span>
      {value !== null && (
        <span className={classes.value}>{value}</span>
      )}
    </button>
  );
};

PickerButton.propTypes = {
  label: PropTypes.string.isRequired,
  openList: PropTypes.func.isRequired,
  value: PropTypes.string,
};

PickerButton.defaultProps = {
  value: null,
};

export default PickerButton;
