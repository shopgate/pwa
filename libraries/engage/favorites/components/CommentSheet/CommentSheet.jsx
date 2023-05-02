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
      title={i18n.text('favorites.list_chooser.asdfasdfasdf')}
      onDidClose={close}
    >
      <SheetList>
        <TextField
          // type={type}
          type="multiLine"
          name="sadf"
          label="label"
          value={value}
          onChange={(newValue) => { setValue(newValue); }}
          errorText="eeee"
          multiLine
          // translateErrorText={false}
          // showErrorText={false}
          // disabled={element.disabled}
        />

        <Button
          type="button"
          // key={date}
          // className={classnames(
          //   styles.button,
          //   styles.buttonDate,
          //   {
          //     [styles.buttonActive]: selectedDate === date,
          //   }
          // )}
          onClick={handleSubmit}
        >

          <span>
               asdf
          </span>

        </Button>
        <div>asdf</div>
        <div>asdf</div>
        <div>asdf</div>
        <div>asdf</div>

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
