import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import {
  makeIsProductOnSpecificFavoriteList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import { i18n } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * @param {Object} state State.
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
    color: `var(--color-state-alert, ${themeConfig.colors.error})`,
  }).toString(),
  add: css({
    color: 'var(--color-state-ok)',
  }).toString(),
};

/**
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ListChooserItem = ({ isOnList }) => (isOnList ? (
  <span className={styles.remove}>
    {i18n.text('favorites.list_chooser.remove')}
  </span>
) : (
  <span className={styles.add}>
    {i18n.text('favorites.list_chooser.add')}
  </span>
));

ListChooserItem.propTypes = {
  isOnList: PropTypes.bool.isRequired,
};

export default connect(makeMapStateToProps)(ListChooserItem);
