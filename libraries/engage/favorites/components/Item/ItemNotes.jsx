import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { connect } from 'react-redux';
import {
  i18n,
} from '@shopgate/engage/core';
import { getWishlistItemNotesEnabled } from '../../../core/selectors/shopSettings';

const styles = {
  root: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  }),
  addCommentButton: css({
    fontSize: 17,
    color: 'var(--color-secondary)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'left',
  }),
  comment: css({
    fontSize: 17,
    color: 'var(--color-text-high-emphasis)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  notes: css({
    paddingRight: 4,
    fontStyle: 'italic',
  }),
  buttons: css({
    whiteSpace: 'nowrap',
  }),
};

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => state => ({
  wishlistItemNotesEnabled: getWishlistItemNotesEnabled(state),
});

/**
 *
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ItemNotes = ({
  wishlistItemNotesEnabled,
  notes,
  onClickOpenComment,
  onClickDeleteComment,
  notesButtonRef,
}) => {
  if (!wishlistItemNotesEnabled) {
    return null;
  }
  /* eslint-disable jsx-a11y/aria-role */
  return (
    <div className={styles.root}>
      {notes && (
        <span role="text">
          <span className={styles.comment}>
            {`${i18n.text('favorites.comments.notes')}: `}
          </span>
          <span className={styles.notes}>{`"${notes}"`}</span>
        </span>
      )}

      <span className={styles.buttons}>
        {/*
          Slightly uncommon approach, but we want to re-use this button to increase
          screen reader support. This approach takes care that there is always one DOM element
          with the "notesId" that can be focused when closing the CommentDialog modal.
        */}
        <button type="button" onClick={onClickOpenComment} className={styles.addCommentButton} ref={notesButtonRef}>
          {notes ? i18n.text('favorites.comments.edit') : i18n.text('favorites.comments.add')}
        </button>
        { notes && (
          <>
            <span aria-hidden> | </span>
            <button type="button" onClick={onClickDeleteComment} className={styles.addCommentButton}>
              {i18n.text('favorites.comments.delete')}
            </button>
          </>
        )}
      </span>
    </div>
  );
  /* eslint-enable jsx-a11y/aria-role */
};

ItemNotes.propTypes = {
  onClickDeleteComment: PropTypes.func.isRequired,
  onClickOpenComment: PropTypes.func.isRequired,
  wishlistItemNotesEnabled: PropTypes.bool.isRequired,
  notes: PropTypes.string,
  notesButtonRef: PropTypes.shape(),
};

ItemNotes.defaultProps = {
  notes: null,
  notesButtonRef: null,
};

export default connect(makeMapStateToProps)(ItemNotes);
