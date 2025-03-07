import { useContext } from 'react';

import ContextMenuContext from './ContextMenuProvider.context';

// eslint-disable-next-line valid-jsdoc
/**
 * Returns the value of the context menu provider state.
 */
export const useContextMenu = () => useContext(ContextMenuContext);
