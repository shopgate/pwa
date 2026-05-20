import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  makeIsProductOnSpecificFavoriteList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { getWishlistItemQuantityEnabled } from '../../../core/selectors/shopSettings';

/**
 * @returns {Object}
 */
const makeMapStateToProps = () => {
  const getIsOnList = makeIsProductOnSpecificFavoriteList(
    (_, props) => props.productId,
    (_, props) => props.listId
  );

  return (state, props) => ({
    isOnList: getIsOnList(state, props),
    wishlistItemQuantityEnabled: getWishlistItemQuantityEnabled(state),

  });
};

const useStyles = makeStyles()(theme => ({
  remove: {
    color: theme.palette.error.main,
  },
  add: {
    color: theme.palette.success.main,
    whiteSpace: 'noWrap',
  },
}));

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ListChooserItem = ({ isOnList, wishlistItemQuantityEnabled }) => {
  const { classes } = useStyles();
  if (wishlistItemQuantityEnabled && isOnList) {
    return (
      <span className={classes.add}>
        {i18n.text('favorites.list_chooser.add_more')}
      </span>);
  }

  if (isOnList) {
    return (
      <span className={classes.remove}>
        {i18n.text('favorites.list_chooser.remove')}
      </span>);
  }

  return (
    <span className={classes.add}>
      {i18n.text('favorites.list_chooser.add')}
    </span>);
};

ListChooserItem.propTypes = {
  isOnList: PropTypes.bool.isRequired,
  wishlistItemQuantityEnabled: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps)(ListChooserItem);
