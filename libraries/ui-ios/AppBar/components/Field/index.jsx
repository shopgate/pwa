import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';

const useStyles = makeStyles()({
  form: {
    display: 'flex',
    flexGrow: 1,
  },
  field: {
    outline: 0,
    padding: '0 16px',
    width: '100%',
  },
});

/**
 * The AppBarField component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const AppBarField = ({ fieldRef, onChange, onSubmit }) => {
  const { classes } = useStyles();

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <input
        className={classes.field}
        onChange={onChange}
        placeholder={i18n.text('search.placeholder')}
        ref={fieldRef}
      />
    </form>
  );
};

AppBarField.propTypes = {
  fieldRef: PropTypes.shape(),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

AppBarField.defaultProps = {
  fieldRef: null,
  onChange: null,
  onSubmit: null,
};

export default AppBarField;
