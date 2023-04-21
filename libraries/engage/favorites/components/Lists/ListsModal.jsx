import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, TextField } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { css } from 'glamor';

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  textField: css({
    textAlign: 'left',
  }),
};

/**
 * @param {Object} props Props
 * @returns {Object}
 */
const ListsModal = ({ type, onConfirm, onDismiss }) => {
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

  /**
   * Submit handler for the text input
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onConfirmWrapped();
    }
  }, [onConfirmWrapped]);

  return (
    <Dialog
      onConfirm={onConfirmWrapped}
      onDismiss={onDismiss}
      modal={{
        title: i18n.text(`favorites.${type}_modal.title`),
        dismiss: i18n.text(`favorites.${type}_modal.dismiss`),
        confirm: i18n.text(`favorites.${type}_modal.confirm`),
        content: (
          <div className={styles.root}>
            <span>{i18n.text(`favorites.${type}_modal.message`)}</span>
            <TextField
              name="name"
              label={i18n.text(`favorites.${type}_modal.label`)}
              onChange={onChange}
              value={input}
              errorText={error || undefined}
              className={styles.textField}
              maxlength="25"
              onKeyPress={handleKeyPress}
            />
          </div>
        ),
      }}
    />
  );
};

ListsModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ListsModal;
