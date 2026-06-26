import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { hasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { Dialog, TextField, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    textAlign: 'left',
    fontSize: theme.typography.body1.fontSize,
  },
}));

/**
 * @param {Object} props Props
 * @param {'add_list'|'rename_list'} [props.type] The modal type
 * @param {Function} props.onConfirm The confirm handler
 * @param {Function} props.onDismiss The dismiss handler
 * @returns {JSX.Element}
 */
const ListsModal = ({ type, onConfirm, onDismiss }) => {
  const { classes } = useStyles();
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const onConfirmWrapped = useCallback(() => {
    if (input.length === 0) {
      setError(i18n.text('favorites.errors.invalid_name'));
      return;
    }
    onConfirm(input);
  }, [input, onConfirm]);

  const onChange = useCallback((value) => {
    setInput(value);
  }, []);

  // Favorites list name was restricted to 25 characters on PWA6 in CCP-2535
  const textFieldMaxLength = useMemo(() => (!hasNewServices() ? '25' : undefined), []);

  return (
    <Dialog
      onConfirm={onConfirmWrapped}
      onDismiss={onDismiss}
      modal={{
        title: i18n.text(`favorites.${type}_modal.title`),
        dismiss: i18n.text(`favorites.${type}_modal.dismiss`),
        confirm: i18n.text(`favorites.${type}_modal.confirm`),
      }}
    >
      <div className={classes.root}>
        <Typography component="span">
          {i18n.text(`favorites.${type}_modal.message`)}
        </Typography>
        <TextField
          name="name"
          placeholder={i18n.text(`favorites.${type}_modal.label`)}
          maxLength={textFieldMaxLength}
          onChange={onChange}
          value={input}
          errorText={error || undefined}
          className={classes.input}
        />
      </div>
    </Dialog>
  );
};

ListsModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  type: PropTypes.string,
};

ListsModal.defaultProps = {
  type: 'add_list',
};

export default ListsModal;
