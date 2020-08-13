import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import {
  Accordion, Card, ContextMenu, SurroundPortals,
} from '@shopgate/engage/components';
import { makeGetFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { FAVORITES_LIST_CONTEXT_MENU } from '../../constants/Portals';
import Item from '../Item';

const styles = {
  title: css({
    flex: 1,
  }).toString(),
  divider: css({
    height: 1,
    width: 'calc(100% + 32px)',
    backgroundColor: 'rgb(234, 234, 234)',
    marginLeft: -16,
    marginRight: -16,
    marginBottom: 16,
  }).toString(),
};

/**
 * Favorite List Label component
 * @return {JSX}
 */
const FavoriteListLabel = ({
  code, title, rename, remove,
}) => (
  <Fragment>
    <span className={styles.title}>
      {title}
    </span>
    <SurroundPortals portalName={FAVORITES_LIST_CONTEXT_MENU} portalProps={{ code }}>
      <ContextMenu>
        <ContextMenu.Item onClick={rename}>
          {i18n.text('favorites.rename_list')}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={remove} disabled={code === 'DEFAULT'}>
          {i18n.text('favorites.remove_list')}
        </ContextMenu.Item>
      </ContextMenu>
    </SurroundPortals>
  </Fragment>
);

FavoriteListLabel.propTypes = {
  code: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

/**
 * @param {Object} _ State
 * @param {Object} props Props
 * @returns {Object}
 */
const makeMapStateToProps = (_, { code }) => {
  const getFavorites = makeGetFavorites(() => code);
  return state => ({
    products: getFavorites(state),
  });
};

/**
 * Favorite List component
 * @return {JSX}
 */
const FavoriteList = ({
  code,
  name,
  products,
  rename,
  remove,
  removeItem,
  addToCart,
}) => (
  <Card>
    <Accordion
      className=""
      openWithChevron
      renderLabel={() =>
        <FavoriteListLabel
          code={code}
          title={name}
          rename={newName => rename(code, newName)}
          remove={remove}
        />
      }
      chevronPosition="left"
      startOpened
    >
      <div className={styles.divider} />
      {products.length === 0 ? (
        <span>{i18n.text('favorites.empty')}</span>
      ) : null}
      {products.map(product => (
        <Item
          key={product.id}
          product={product}
          addToCart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return addToCart(product);
          }}
          remove={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeItem(product.id);
          }}
        />
      ))}
    </Accordion>
  </Card>
);

FavoriteList.propTypes = {
  addToCart: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  remove: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

export default connect(makeMapStateToProps)(FavoriteList);
