import { main$ } from '@shopgate/pwa-common/streams/main';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import createToast from '@shopgate/pwa-common/actions/toast/createToast';
import deleteAccountAction from './action';

export default (subscribe) => {
  const deleteAccountRequested$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_REQUESTED');
  const deleteAccountSuccess$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_SUCCESS');
  const deleteAccountFailed$ = main$.filter(({ action }) => action.type === 'DELETE_ACCOUNT_FAILED');

  subscribe(deleteAccountRequested$, async ({ dispatch }) => {
    const confirmed = await dispatch(showModal({
      message: 'user.delete_account_confirm',
      title: null,
    }));
    if (confirmed) {
      deleteAccountAction()(dispatch);
    }
  });

  subscribe(deleteAccountSuccess$, ({ dispatch }) => {
    dispatch({
      type: 'TOGGLE_NAV_DRAWER',
      active: false,
    });

    dispatch(createToast({
      duration: 2000,
      message: 'user.delete_account_success',
    }));
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
