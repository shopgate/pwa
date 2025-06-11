import type { WidgetContextType } from '../components/Widgets/WidgetContext';

/**
 * The useWidget hook provides access to the context that is wrapped around a widget.
 * @returns The widget context.
 */
export declare function useWidget<C = Record<string, any>>(): WidgetContextType<C>
