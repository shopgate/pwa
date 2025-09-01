import { produce } from 'immer';
import {
  REQUEST_PAGE_CONFIG_V2,
  RECEIVE_PAGE_CONFIG_V2,
  ERROR_PAGE_CONFIG_V2,
  PAGE_STATE_LIFETIME,
} from '../constants';

const customWidgetRegex = /<!--Widget(.*)-->/gmus;

/**
 * Decodes entities from a HTML string
 * @param {string} html HTML string to decode
 * @returns {string}
 */
const decodeHTMLEntities = (html = '') => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * @param {Object} data The page data object
 * @returns {Object} The sanitized page data
 */
const transformCustomLegacyWidgets = (data) => {
  if (!Array.isArray(data?.dropzones?.cmsWidgetList)) {
    return data;
  }

  const { cmsWidgetList } = data.dropzones;
  const transformedWidgets = cmsWidgetList.map((widget) => {
    if (widget.widgetConfigDefinitionCode !== '@shopgate/widgets/htmlWidget' || !widget?.widgetConfig?.html) {
      return widget;
    }

    const content = decodeHTMLEntities(widget.widgetConfig.html.trim());

    if (content.startsWith('<!--Widget')) {
      try {
        const settings = customWidgetRegex.exec(content);

        customWidgetRegex.lastIndex = 0;

        if (settings[0] === content) {
          const customLegacyWidget = JSON.parse(settings[1]);

          // Convert legacy widget data to the new format
          return {
            ...widget,
            widgetConfig: customLegacyWidget.settings || {},
            widgetConfigDefinitionCode: customLegacyWidget.type || '',
            isCustomLegacyWidget: true,
          };
        }
      } catch (err) {
        // Nothing to do here
      }
    }

    return widget;
  });

  return {
    ...data,
    dropzones: {
      ...data.dropzones,
      cmsWidgetList: transformedWidgets,
    },
  };
};

const defaultState = {};

/**
 * Stores state of the v2 implementation of pages.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @returns {Object} The new state.
 */
export function pageV2(state = defaultState, action) {
  /* eslint-disable no-param-reassign */
  const producer = produce((draft) => {
    switch (action.type) {
      case REQUEST_PAGE_CONFIG_V2: {
        const { pageType, pageSlug } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          data: null,
          isFetching: true,
          expires: 0,
        };
        break;
      }

      case RECEIVE_PAGE_CONFIG_V2: {
        const { pageType, pageSlug, data } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          data: transformCustomLegacyWidgets(data),
          isFetching: false,
          expires: Date.now() + PAGE_STATE_LIFETIME,
        };
        break;
      }

      case ERROR_PAGE_CONFIG_V2: {
        const { pageType, pageSlug } = action;
        draft[pageType] = draft[pageType] || {};
        draft[pageType][pageSlug] = {
          data: null,
          isFetching: false,
        };
        break;
      }
      default:
        break;
    }
  });

  /* eslint-enable no-param-reassign */

  return producer(state);
}
