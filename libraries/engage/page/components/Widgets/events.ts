import { useEffect } from 'react';

/**
 * Names of the events that are dispatched in the context of widget preview iframe communication.
 */
export type WidgetPreviewEventName = 'highlight-widget' | 'widget-clicked' | 'set-active-widget-id';

/**
 * Detail payload of a widget preview event.
 */
export interface WidgetPreviewEventDetail {
  /**
   * The code of the widget related to the event.
   */
  widgetCode: string;
  /**
   * Optional payload data related to the event.
   */
  payload?: unknown;
}

/**
 * Handler for a widget preview event.
 */
export type WidgetPreviewEventHandler = (event: CustomEvent<WidgetPreviewEventDetail>) => void;

/**
 * Hook to listen for widget preview events.
 * These events are dispatched in the context of iFrame communication at the widget preview.
 * @param eventName Name of the listened event
 * @param handler A callback function to handle the event
 */
export const useWidgetPreviewEvent = (
  eventName: WidgetPreviewEventName,
  handler: WidgetPreviewEventHandler
) => {
  useEffect(() => {
    window.addEventListener(`widget-preview-${eventName}`, handler as EventListener);

    return () => {
      window.removeEventListener(`widget-preview-${eventName}`, handler as EventListener);
    };
  }, [eventName, handler]);
};

/**
 * Dispatches widget preview related events.
 * Used to trigger iFrame postMessage events to the parent window or to react on incoming
 * postMessage events from the parent window.
 * @param eventName Name of the event to dispatch
 * @param widgetCode Code of the widget to dispatch the event for
 * @param payload Optional payload to include with the event
 */
export const dispatchWidgetPreviewEvent = (
  eventName: WidgetPreviewEventName,
  widgetCode: string,
  payload: unknown = null
) => {
  const event = new CustomEvent<WidgetPreviewEventDetail>(`widget-preview-${eventName}`, {
    detail: {
      widgetCode,
      payload,
    },
  });

  window.dispatchEvent(event);
};
