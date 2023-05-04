import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { getCommentSheetSettings } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n } from '@shopgate/engage/core';
import { SheetList, SheetDrawer, Button } from '@shopgate/engage/components';
import {
  closeFavoritesCommentSheet,
} from '@shopgate/pwa-common-commerce/favorites/action-creators';
import { updateFavorite } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import I18n from '@shopgate/pwa-common/components/I18n';
import { css } from 'glamor';

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  settings: getCommentSheetSettings(state),
});

/**
 * @param {Object} dispatch Dispatch.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeFavoritesCommentSheet()),
  updateFavoriteItem: (productId, listId, quantity, notes) => {
    dispatch(updateFavorite(productId, listId, quantity, notes));
  },
});

const styles = {
  root: css({
    paddingBottom: 100,
  }).toString(),
  button: css({
    marginTop: 16,
    marginBottom: 16,
  }).toString(),
};

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const CommentSheet = ({
  settings, close, updateFavoriteItem,
}) => {
  const isVisible = !!settings;
  const { productId, listId, item } = settings || {};
  const [value, setValue] = useState(item?.notes);

  useEffect(() => { setValue(item?.notes); }, [item]);

  // eslint-disable-next-line require-jsdoc
  const handleSubmit = () => {
    updateFavoriteItem(productId, listId, undefined, value);
    close();
  };

  return (
    <SheetDrawer
      isOpen={isVisible}
      title={i18n.text('favorites.add_comment.title')}
      onDidClose={close}
      className={styles.root}
    >
      <SheetList>
        <TextField
          name="comment"
          value={value}
          onChange={(newValue) => { setValue(newValue); }}
          multiLine
        />
        <Button
          className={styles.button}
          type="secondary"
          onClick={handleSubmit}
        >
          <I18n.Text string="favorites.add_comment.button" />
        </Button>
      </SheetList>
    </SheetDrawer>
  );
};

CommentSheet.propTypes = {
  close: PropTypes.func.isRequired,
  updateFavoriteItem: PropTypes.func.isRequired,
  settings: PropTypes.shape(),
};

CommentSheet.defaultProps = {
  settings: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentSheet);
