import { reloadApp$ } from '../streams';

/**
 * App subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function app(subscribe) {
  subscribe(reloadApp$, () => {
    window.location.reload();
  });
}
