import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { ContextMenu, SurroundPortals } from '@shopgate/engage/components';
import { FAVORITES_LIST_CONTEXT_MENU } from '../../constants';

/**
 * Favorite List Accordion header component
 * @param {Object} props The component props
 * @param {Function} props.rename The rename function
 * @param {Function} props.remove The remove function
 * @param {string} props.id The label name
 * @return {JSX.Element}
 */
const ListAccordionHeader = ({
  rename, remove, id,
}) => (
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
);

ListAccordionHeader.propTypes = {
  id: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  rename: PropTypes.func.isRequired,
};

export default ListAccordionHeader;
