import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { getCommentDialogSettings } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n, usePrevious } from '@shopgate/engage/core';
import {
  Dialog,
  TextField,
} from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import {
  closeFavoritesCommentDialog,
} from '@shopgate/pwa-common-commerce/favorites/action-creators';
import { themeName } from '@shopgate/pwa-common/helpers/config';
import { updateFavorite } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import I18n from '@shopgate/pwa-common/components/I18n';

const isIos = themeName.includes('ios');

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  settings: getCommentDialogSettings(state),
});

/**
 * @param {Object} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeFavoritesCommentDialog()),
  updateFavoriteItem: (productId, listId, quantity, notes) => {
    dispatch(updateFavorite(productId, listId, quantity, notes));
  },
});

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  input: css({
    textAlign: 'left',
    fontSize: '1rem',
  }).toString(),
  characterCount: css({
    textAlign: 'right',
    marginTop: -16,
    fontSize: '0.875rem',
    color: 'var(--color-text-medium-emphasis)',
  }).toString(),
};

const MAX_CHARACTER_COUNT = 250;

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const CommentDialog = ({
  settings, close, updateFavoriteItem,
}) => {
  const isVisible = !!settings;
  const { productId, listId, item } = settings || {};
  const prevProdId = usePrevious(productId);
  const [value, setValue] = useState(item?.notes);

  useEffect(() => {
    if (prevProdId !== productId) {
      setValue(item?.notes);
    }
  }, [item, prevProdId, productId]);

  const handleSubmit = useCallback(() => {
    updateFavoriteItem(productId, listId, undefined, value);
    if (!item?.notes && !!value) {
      broadcastLiveMessage('favorites.comments.added');
    }

    if (item?.notes && value !== item.notes) {
      broadcastLiveMessage('favorites.comments.updated');
    }

    close();
  }, [close, item, listId, productId, updateFavoriteItem, value]);

  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  const attributes = useMemo(() => ({
    style: {
      maxHeight: 150,
      placeholder: i18n.text('favorites.comment_modal.label'),
    },
    maxLength: MAX_CHARACTER_COUNT,
  }), []);

  if (!isVisible) {
    return null;
  }

  return (
    <Dialog
      onConfirm={handleSubmit}
      onDismiss={close}
      modal={{
        title: i18n.text(`favorites.comment_modal.${(item?.notes || '').length === 0 ? 'titleAdd' : 'titleEdit'}`),
        dismiss: i18n.text('favorites.comment_modal.dismiss'),
        confirm: i18n.text('favorites.comment_modal.confirm'),
      }}
    >
      <div className={styles.root}>
        <TextField
          name="name"
          {...isIos ? {
            placeholder: i18n.text('favorites.comment_modal.label'),
          } : {
            label: i18n.text('favorites.comment_modal.label'),
          }}
          onChange={handleChange}
          value={value}
          className={styles.input}
          attributes={attributes}
          multiLine
          tabIndex={0}
        />
        <I18n.Text
          className={styles.characterCount}
          string="favorites.comment_modal.characterCount"
          aria-hidden
          params={{
            maxCount: MAX_CHARACTER_COUNT,
            count: value?.length || 0,
          }}
        />
      </div>
    </Dialog>
  );
};

CommentDialog.propTypes = {
  close: PropTypes.func.isRequired,
  updateFavoriteItem: PropTypes.func.isRequired,
  settings: PropTypes.shape(),
};

CommentDialog.defaultProps = {
  settings: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentDialog);
