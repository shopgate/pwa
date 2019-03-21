import React from 'react';
import { mount } from 'enzyme';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
  SCANNER_MIN_APP_LIB_VERSION,
} from '@shopgate/pwa-core/constants/Scanner';
import CameraOverlay from './components/CameraOverlay';
import FlashlightButton from './components/ScannerBar/components/FlashlightButton';
import ScannerOverlay from './index';

jest.mock('@shopgate/pwa-core/classes/AppCommand');

defaultClientInformation.libVersion = SCANNER_MIN_APP_LIB_VERSION;

describe('<ScannerOverlay />', () => {
  const toggleFlashlightSpy = jest.spyOn(AppScanner, 'toggleFlashlight');

  it('should render the component', () => {
    const wrapper = mount(<ScannerOverlay />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(CameraOverlay)).not.toBeEmptyRender();
    expect(wrapper.find(CameraOverlay)).not.toBeEmptyRender();
    expect(wrapper.state('flashlight')).toBe(false);
  });

  it('should toggle the flashlight when the button is pressed', async () => {
    await AppScanner.open(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE);

    const wrapper = mount(<ScannerOverlay />);
    const button = wrapper.find(FlashlightButton);

    button.simulate('click');
    expect(wrapper.state('flashlight')).toBe(true);
    expect(toggleFlashlightSpy).toHaveBeenCalledTimes(1);

    button.simulate('click');
    expect(wrapper.state('flashlight')).toBe(false);
    expect(toggleFlashlightSpy).toHaveBeenCalledTimes(2);
  });
});

