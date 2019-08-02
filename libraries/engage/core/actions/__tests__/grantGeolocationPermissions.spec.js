import { PERMISSION_ID_LOCATION } from '@shopgate/pwa-core/constants/AppPermissions';
import grantPermissions from '../grantPermissions';
import grantGeolocationPermissions from '../grantGeolocationPermissions';

jest.mock('../grantPermissions', () => jest.fn().mockReturnValue('grantPermissions'));

describe('engage > core > actions > grantGeolocationPermissions', () => {
  const dispatch = jest.fn(action => action);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch as expected without options', () => {
    const result = grantGeolocationPermissions()(dispatch);
    expect(result).toEqual(grantPermissions());
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(grantPermissions());
    expect(grantPermissions).toHaveBeenCalledTimes(3);
    expect(grantPermissions).toHaveBeenCalledWith({
      permissionId: PERMISSION_ID_LOCATION,
      useSettingsModal: false,
      modal: {
        title: null,
        message: 'permissions.access_denied.geolocation_message',
        confirm: 'permissions.access_denied.settings_button',
      },
    });
  });

  it('should dispatch as expected with some custom modal options', () => {
    const customModalOptions = {
      title: 'Modal title',
      dismiss: 'Dismiss label',
    };

    const result = grantGeolocationPermissions({
      useSettingsModal: true,
      modal: customModalOptions,
    })(dispatch);
    expect(result).toEqual(grantPermissions());
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(grantPermissions());
    expect(grantPermissions).toHaveBeenCalledTimes(3);
    expect(grantPermissions).toHaveBeenCalledWith({
      permissionId: PERMISSION_ID_LOCATION,
      useSettingsModal: true,
      modal: {
        title: 'Modal title',
        message: 'permissions.access_denied.geolocation_message',
        confirm: 'permissions.access_denied.settings_button',
        dismiss: 'Dismiss label',
      },
    });
  });

  it('should dispatch as expected with complete custom modal options', () => {
    const customModalOptions = {
      title: 'Modal title',
      message: 'Modal message',
      confirm: 'Confirm label',
      dismiss: 'Dismiss label',
      params: {
        param: 'one',
      },
    };

    const result = grantGeolocationPermissions({
      useSettingsModal: true,
      modal: customModalOptions,
    })(dispatch);
    expect(result).toEqual(grantPermissions());
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(grantPermissions());
    expect(grantPermissions).toHaveBeenCalledTimes(3);
    expect(grantPermissions).toHaveBeenCalledWith({
      permissionId: PERMISSION_ID_LOCATION,
      useSettingsModal: true,
      modal: customModalOptions,
    });
  });
});
