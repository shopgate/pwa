import { main$ } from '@shopgate/pwa-common/streams/main';
import { logout, userDidLogout$ } from '@shopgate/engage/user';
import { historyPush } from '@shopgate/engage/core';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import deleteAccountAction from './action';

export default (subscribe) => {
  const deleteAccountRequested$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_REQUESTED');
  const deleteAccountSuccess$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_SUCCESS');
  const deleteAccountFailed$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_FAILED');

  const processSuccess$ = deleteAccountSuccess$.zip(userDidLogout$).map(([first]) => first);

  subscribe(deleteAccountRequested$, async ({ dispatch }) => {
    const confirmed = await dispatch(showModal({
      message: 'user.delete_account_confirm',
      title: null,
    }));
    if (confirmed) {
      dispatch(deleteAccountAction());
      dispatch(logout(false));
    }
  });

  subscribe(processSuccess$, async ({ dispatch }) => {
    NavDrawer.close();

    const confirmed = await dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: 'user.contact_us',
      message: 'user.delete_account_success',
      title: null,
    }));

    if (confirmed === false) {
      // User pressed the "contact us" button
      dispatch(historyPush({
        pathname: '/page/imprint',
      }));
    }
  });

  subscribe(deleteAccountFailed$, ({ dispatch }) => {
    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message: 'user.delete_account_error',
      title: null,
    }));
  });
};
