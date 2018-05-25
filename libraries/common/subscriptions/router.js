import conductor from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
} from '@virtuous/conductor/constants';
import * as handler from './helpers/handleLinks';
import { navigate$ } from '../streams/router';

/**
 * Router subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function router(subscribe) {
  subscribe(navigate$, ({ action }) => {
    const { action: historyAction, location, state } = action;

    // If there is one of the known protocols in the url.
    if (handler.hasKnownProtocols(location)) {
      if (handler.isExternalLink(location)) handler.openExternalLink(location);
      else if (handler.isNativeLink(location)) handler.openNativeLink(location);
      return;
    }

    if (handler.isLegacyPage(location)) {
      handler.openLegacy(location);
      return;
    }

    if (handler.isLegacyLink(location)) {
      handler.openLegacyLink(location);
      return;
    }

    switch (historyAction) {
      case ACTION_POP: {
        conductor.pop();
        break;
      }
      case ACTION_PUSH: {
        conductor.push(location, state);
        break;
      }
      case ACTION_REPLACE: {
        conductor.replace(location, state);
        break;
      }
      default:
        break;
    }
  });
}
