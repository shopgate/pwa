import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { connect } from 'react-redux';
import { RippleButton } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { toggleFavoriteWithListChooser } from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  makeIsProductOnFavoriteList,
  hasMultipleFavoritesList,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * @param {Object} state State.
 * @returns {Object}
 */
const makeMapStateToProps = () => {
  const getIsOnList = makeIsProductOnFavoriteList((_, props) => props.productId);
  return (state, props) => ({
    isOnList: getIsOnList(state, props),
    hasMultipleLists: hasMultipleFavoritesList(state),
  });
};

/**
 * @param {Function} dispatch Dispatch
 * @returns {Object}
 * */
const mapDispatchToProps = dispatch => ({
  toggle: productId => dispatch(toggleFavoriteWithListChooser(productId)),
});

const styles = {
  root: css({
    '&&': {
      margin: '0 0px 16px 16px',
      backgroundColor: '#fff',
      border: '1px solid var(--color-primary)',
      color: 'var(--color-high-emphasis)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
    },
  }).toString(),
  ripple: css({
    padding: '8px 16px',
  }).toString(),
};

/** @returns {JSX} */
const FavoriteButtonWide = ({
  productId,
  toggle,
  isOnList,
  hasMultipleLists,
}) => {
  const label = useMemo(() => {
    if (!isOnList) {
      return 'favorites.add_to_list';
    } if (hasMultipleLists) {
      return 'favorites.edit_lists';
    }

    return 'favorites.remove_from_list';
  }, [hasMultipleLists, isOnList]);

  if (!appConfig.hasFavorites) {
    return null;
  }

  return (
    <RippleButton
      className={styles.root}
      rippleClassName={styles.ripple}
      type="primary"
      onClick={() => toggle(productId)}
    >
      { i18n.text(label) }
    </RippleButton>
  );
};

FavoriteButtonWide.propTypes = {
  hasMultipleLists: PropTypes.bool.isRequired,
  isOnList: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(FavoriteButtonWide);
