import { toggleLogin } from 'Components/Navigator/action-creators';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import disableNavigatorTitle from 'Components/Navigator/actions/disableNavigatorTitle';
import enableNavigatorTitle from 'Components/Navigator/actions/enableNavigatorTitle';
import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';
import { loginWillEnter$, loginWillLeave$ } from './streams';

/**
 * Login subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function login(subscribe) {
  subscribe(loginWillEnter$, ({ dispatch }) => {
    dispatch(toggleLogin(true));
    dispatch(disableNavigatorTitle());
    dispatch(disableNavigatorSearch());
    dispatch(toggleCartIcon(false));
  });

  subscribe(loginWillLeave$, ({ dispatch }) => {
    dispatch(toggleLogin(false));
    dispatch(enableNavigatorTitle());
    dispatch(enableNavigatorSearch());
    dispatch(toggleCartIcon(true));
  });
}
