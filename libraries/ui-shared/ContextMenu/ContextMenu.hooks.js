import { useContext } from 'react';

import ContextMenuContext from './ContextMenuProvider.context';

/**
 * Returns the value of the context menu provider state.
 * @returns {Object}
 */
export const useContextMenu = () => useContext(ContextMenuContext);
