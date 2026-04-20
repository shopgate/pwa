import { createSelector } from 'reselect';
import { getUserData } from '@shopgate/pwa-common/selectors/user';

export const getUserLastName = createSelector(
  getUserData,
  (data) => {
    if (!data) {
      return null;
    }

    return data.lastName;
  }
);

export const getUserId = createSelector(
  getUserData,
  (data) =>{
    if (!data) {
      return null;
    }

    return data.id;
  }
)
