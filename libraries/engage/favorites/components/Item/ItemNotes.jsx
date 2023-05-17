import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { connect } from 'react-redux';
import {
  i18n,
} from '@shopgate/engage/core';
import { getWishlistItemNotesEnabled } from '../../../core/selectors/merchantSettings';

const styles = {
  addCommentButton: css({
    fontSize: 17,
    color: 'var(--color-secondary)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: 10,
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
    marginBottom: 10,
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
}) => {
  if (!wishlistItemNotesEnabled) {
    return null;
  }

  return (
    <>
      { notes ? (
        <div>
          <span className={styles.comment}>
            {`${i18n.text('favorites.comments.notes')}: `}
          </span>
          <span className={styles.notes}>{`"${notes}"`}</span>
          <span className={styles.buttons}>
            <button type="button" onClick={onClickOpenComment} className={styles.addCommentButton}>
              {i18n.text('favorites.comments.edit')}
            </button>
            { ' | '}
            <button type="button" onClick={onClickDeleteComment} className={styles.addCommentButton}>
              {i18n.text('favorites.comments.delete')}
            </button>
          </span>
        </div>
      ) : (
        <button type="button" onClick={onClickOpenComment} className={styles.addCommentButton}>
          {i18n.text('favorites.comments.add')}
        </button>
      )}
    </>
  );
};

ItemNotes.propTypes = {
  onClickDeleteComment: PropTypes.func.isRequired,
  onClickOpenComment: PropTypes.func.isRequired,
  wishlistItemNotesEnabled: PropTypes.bool.isRequired,
  notes: PropTypes.string,
};

ItemNotes.defaultProps = {
  notes: null,
};

export default connect(makeMapStateToProps)(ItemNotes);
