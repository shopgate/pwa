import { main$ } from '@shopgate/pwa-common/streams/main';
import ToastProvider from '@shopgate/pwa-common/providers/toast';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
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

  subscribe(deleteAccountSuccess$, ({ events }) => {
    NavDrawer.close();

    events.emit(ToastProvider.ADD, {
      id: 'user.account.deleted',
      message: 'user.delete_account_success',
    });
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
