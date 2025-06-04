import { useEffect } from 'react';

/**
 * @typedef {"highlight-widget"|"widget-clicked"} WidgetPreviewEventName
 */

/**
 * @typedef {Object} WidgetPreviewEventDetail
 * @property {string} widgetCode The code of the widget related to the event.
 * @property {any} [payload] Optional payload data related to the event.
 */

/**
 * @callback WidgetPreviewEventHandler
 * @param {CustomEvent<WidgetPreviewEventDetail>} event The custom event dispatched for the widget
 * preview.
 */

/**
 * Hook to listen for widget preview events.
 * These events are dispatched in the context of iFrame communication at the widget preview.
 * @param {WidgetPreviewEventName} eventName Name of the listened event
 * @param {WidgetPreviewEventHandler} handler A callback function to handle the event
 */
export const useWidgetPreviewEvent = (eventName, handler) => {
  useEffect(() => {
    window.addEventListener(`widget-preview-${eventName}`, handler);

    return () => {
      window.removeEventListener(`widget-preview-${eventName}`, handler);
    };
  }, [eventName, handler]);
};

/**
 * Dispatches widget preview related events.
 * Used to trigger iFrame postMessage events to the parent window or to react on incoming
 * postMessage events from the parent window.
 * @param {WidgetPreviewEventName} eventName Name of the event to dispatch
 * @param {string} widgetCode Code of the widget to dispatch the event for
 * @param {Object} [payload] Optional payload to include with the event
 */
export const dispatchWidgetPreviewEvent = (eventName, widgetCode, payload = null) => {
  const event = new CustomEvent(`widget-preview-${eventName}`, {
    detail: {
      widgetCode,
      payload,
    },
  });

  window.dispatchEvent(event);
};
