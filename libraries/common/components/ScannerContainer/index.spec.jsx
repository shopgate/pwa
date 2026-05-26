import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, screen, waitFor } from '@shopgate/pwa-unit-test/rtlUtils';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
  SCANNER_MIN_APP_LIB_VERSION,
} from '@shopgate/pwa-core/constants/Scanner';
import ScannerContainer from './index';

jest.mock('@shopgate/pwa-core/helpers', () => {
  const actual = jest.requireActual('@shopgate/pwa-core/helpers');
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
 * @return {Object} Render result.
 */
const createWrapper = (libVersion = SCANNER_MIN_APP_LIB_VERSION) => {
  // Change the lib version of the client information for the internal checks of the Scanner class.
  defaultClientInformation.libVersion = libVersion;

  const store = configureStore()({
    client: {
      info: {
        libVersion,
      },
    },
  });

  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );

  return render(
    <ScannerContainer
      scannerDidOpen={scannerDidOpen}
      scannerDidClose={scannerDidClose}
      scope={SCANNER_SCOPE_DEFAULT}
      type={SCANNER_TYPE_BARCODE}
    >
      <div>Container Children</div>
    </ScannerContainer>,
    { wrapper: Wrapper }
  );
};

describe('<ScannerContainer />', () => {
  const scannerOpenSpy = jest.spyOn(AppScanner, 'open');
  const scannerCloseSpy = jest.spyOn(AppScanner, 'close');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component when the scanner is supported', () => {
    createWrapper();
    expect(screen.getByText('Container Children')).toBeInTheDocument();
  });

  it('should not render the component when the scanner is not supported', () => {
    createWrapper('10.0.0');
    expect(screen.queryByText('Container Children')).not.toBeInTheDocument();
  });

  it('should open the scanner when the component mounts', async () => {
    createWrapper();

    await waitFor(() => {
      expect(scannerOpenSpy).toHaveBeenCalledTimes(1);
    });
    expect(scannerDidOpen).toHaveBeenCalledTimes(1);
  });

  it('should not open the scanner when the component mounts and the scanner is not supported', async () => {
    createWrapper('10.0.0');

    expect(scannerDidOpen).not.toHaveBeenCalled();
    expect(scannerOpenSpy).not.toHaveBeenCalled();
  });

  it('should close the scanner when the component unmounts', () => {
    const { unmount } = createWrapper();
    unmount();
    expect(scannerDidClose).toHaveBeenCalledTimes(1);
    expect(scannerCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('should not close the scanner when the component unmounts and the scanner is not supported', () => {
    const { unmount } = createWrapper('10.0.0');
    unmount();
    expect(scannerDidClose).not.toHaveBeenCalled();
    expect(scannerCloseSpy).not.toHaveBeenCalled();
  });
});
