import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  ContextMenu,
  SurroundPortals,
} from '@shopgate/engage/components';
import { FAVORITES_LIST_CONTEXT_MENU } from '../../constants/Portals';
import styles from './styles';

/**
 * Favorite List Label component
 * @return {JSX}
 */
const ListAccordionLabel = ({
  id, title, rename, remove,
}) => (
  <>
    <span className={styles.title}>
      {title}
    </span>
    <SurroundPortals portalName={FAVORITES_LIST_CONTEXT_MENU} portalProps={{ id }}>
      <ContextMenu>
        <ContextMenu.Item onClick={rename}>
          {i18n.text('favorites.rename_list')}
        </ContextMenu.Item>
        <ContextMenu.Item onClick={remove} disabled={id === 'DEFAULT'}>
          {i18n.text('favorites.remove_list')}
        </ContextMenu.Item>
      </ContextMenu>
    </SurroundPortals>
  </>
);

ListAccordionLabel.propTypes = {
  id: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ListAccordionLabel;
