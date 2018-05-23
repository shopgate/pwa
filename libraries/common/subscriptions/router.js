import conductor from '@virtuous/conductor';
import {
  ACTION_POP,
  ACTION_PUSH,
  ACTION_REPLACE,
} from '@virtuous/conductor/constants';
import { navigate$ } from '../streams/router';

/**
 * Router subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function router(subscribe) {
  /**
   * Gets triggered when the navigation action is intended.
   */
  subscribe(navigate$, ({ action }) => {
    const { action: historyAction, location, state } = action;

    switch (historyAction) {
      case ACTION_POP: {
        conductor.pop();
        break;
      }
      case ACTION_PUSH: {
        console.warn('PUSHING');
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
