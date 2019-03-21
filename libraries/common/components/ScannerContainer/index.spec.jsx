import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
  SCANNER_MIN_APP_LIB_VERSION,
} from '@shopgate/pwa-core/constants/Scanner';
import ScannerContainer from './index';

jest.mock('@shopgate/pwa-core/helpers', () => {
  const actual = require.requireActual('@shopgate/pwa-core/helpers');
  return {
    ...actual,
    logger: {
      groupCollapsed: jest.fn(),
      error: jest.fn(),
    },
  };
});

const scannerDidClose = jest.fn();
const scannerDidOpen = jest.fn();

/**
 * @param {string} libVersion An app lib version.
 * @return {JSX}
 */
const createWrapper = (libVersion = SCANNER_MIN_APP_LIB_VERSION) => {
  // Change the lib version of the client information for the internal checks of the Scanner class.
  defaultClientInformation.libVersion = libVersion;

  const store = configureStore()({
    client: {
      libVersion,
    },
  });

  return mount((
    <Provider store={store}>
      <ScannerContainer
        scannerDidOpen={scannerDidOpen}
        scannerDidClose={scannerDidClose}
        scope={SCANNER_SCOPE_DEFAULT}
        type={SCANNER_TYPE_BARCODE}
      >
        <div>Container Children</div>
      </ScannerContainer>
    </Provider>));
};

describe('<ScannerContainer />', () => {
  const scannerOpenSpy = jest.spyOn(AppScanner, 'open');
  const scannerCloseSpy = jest.spyOn(AppScanner, 'close');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component when the scanner is supported', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(ScannerContainer)).not.toBeEmptyRender();
  });

  it('should not render the component when the scanner is not supported', () => {
    const wrapper = createWrapper('10.0.0');
    expect(wrapper.find(ScannerContainer)).toBeEmptyRender();
  });

  it('should open the scanner when the component mounts', async () => {
    const wrapper = createWrapper();
    await wrapper.find(ScannerContainer).instance().componentDidMount();

    expect(scannerDidOpen).toHaveBeenCalledTimes(1);
    expect(scannerOpenSpy).toHaveBeenCalledTimes(1);
  });

  it('should not open the scanner when the component mounts and the scanner is not supported', async () => {
    const wrapper = createWrapper('10.0.0');
    await wrapper.find(ScannerContainer).instance().componentDidMount();

    expect(scannerDidOpen).not.toHaveBeenCalled();
    expect(scannerOpenSpy).not.toHaveBeenCalled();
  });

  it('should close the scanner when the component unmounts', () => {
    const wrapper = createWrapper();
    wrapper.unmount();
    expect(scannerDidClose).toHaveBeenCalledTimes(1);
    expect(scannerCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('should not close the scanner when the component unmounts and the scanner is not supported', () => {
    const wrapper = createWrapper('10.0.0');
    wrapper.unmount();
    expect(scannerDidClose).not.toHaveBeenCalled();
    expect(scannerCloseSpy).not.toHaveBeenCalled();
  });
});
