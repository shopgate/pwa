import { useContext } from 'react';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets';

/**
 * @typedef {import('../components/Widgets/WidgetContext').WidgetContextType} WidgetContextType
 */

/**
 * The useWidget hook provides access to the context that is wrapped around a widget.
 * @returns {WidgetContextType} The widget context.
 */
export const useWidget = () => useContext(WidgetContext);
