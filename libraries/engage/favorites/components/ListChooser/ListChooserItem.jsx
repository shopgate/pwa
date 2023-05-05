import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import {
  makeIsProductOnSpecificFavoriteList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';

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
  });
};

const styles = {
  remove: css({
    color: 'var(--color-state-alert)',
  }).toString(),
  add: css({
    color: 'var(--color-state-ok)',
    whiteSpace: 'noWrap',
  }).toString(),
};

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ListChooserItem = ({ isOnList }) => {
  if (appConfig.hasExtendedFavorites && isOnList) {
    return (
      <span className={styles.add}>
        {i18n.text('favorites.list_chooser.add_more')}
      </span>);
  }

  if (isOnList) {
    return (
      <span className={styles.remove}>
        {i18n.text('favorites.list_chooser.remove')}
      </span>);
  }

  return (
    <span className={styles.add}>
      {i18n.text('favorites.list_chooser.add')}
    </span>);
};

ListChooserItem.propTypes = {
  isOnList: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps)(ListChooserItem);
