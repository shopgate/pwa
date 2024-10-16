import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { Dialog, TextField } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { themeName } from '@shopgate/pwa-common/helpers/config';
import { css } from 'glamor';

const isIos = themeName.includes('ios');

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  input: css({
    textAlign: 'left',
    fontSize: '1rem',
  }).toString(),
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
      <div className={styles.root}>
        <span>{i18n.text(`favorites.${type}_modal.message`)}</span>
        <TextField
          name="name"
          {...isIos ? {
            placeholder: i18n.text(`favorites.${type}_modal.label`),
          } : {
            label: i18n.text(`favorites.${type}_modal.label`),
          }}
          maxLength={textFieldMaxLength}
          onChange={onChange}
          value={input}
          errorText={error || undefined}
          className={styles.input}
        />
      </div>
    </Dialog>
  );
};

ListsModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default ListsModal;
