import React from 'react';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { defaultClientInformation } from '@shopgate/pwa-core/helpers/version';
import AppScanner from '@shopgate/pwa-core/classes/Scanner';
import {
  SCANNER_SCOPE_DEFAULT,
  SCANNER_TYPE_BARCODE,
  SCANNER_MIN_APP_LIB_VERSION,
} from '@shopgate/pwa-core/constants/Scanner';
import ScannerOverlay from './index';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');

  return {
    ...actual,
    createPortal: element => (
      <div id="portal-content">{element}</div>
    ),
  };
});

jest.mock('@shopgate/engage/components');

defaultClientInformation.libVersion = SCANNER_MIN_APP_LIB_VERSION;

describe('<ScannerOverlay />', () => {
  const toggleFlashlightSpy = jest.spyOn(AppScanner, 'toggleFlashlight');

  beforeEach(() => {
    toggleFlashlightSpy.mockClear();
  });

  it('should render the component', () => {
    const { container } = render(<ScannerOverlay />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText('scanner.instructions')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('scanner.flashlight.off');
    expect(screen.getByRole('link', { name: 'scanner.flashlight.switchOn' })).toBeInTheDocument();
  });

  it('should toggle the flashlight when the button is pressed', async () => {
    await AppScanner.open(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE);

    render(<ScannerOverlay />);
    const button = screen.getByRole('link', { name: 'scanner.flashlight.switchOn' });

    fireEvent.click(button);

    expect(screen.getByRole('status')).toHaveTextContent('scanner.flashlight.on');
    expect(screen.getByRole('link', { name: 'scanner.flashlight.switchOff' })).toBeInTheDocument();
    expect(toggleFlashlightSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('link', { name: 'scanner.flashlight.switchOff' }));
    expect(screen.getByRole('status')).toHaveTextContent('scanner.flashlight.off');
    expect(toggleFlashlightSpy).toHaveBeenCalledTimes(2);
  });
});

