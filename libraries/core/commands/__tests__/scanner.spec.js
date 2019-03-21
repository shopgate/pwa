import { PWA_DEFAULT_TAB } from '../../constants/Command';
import * as constants from '../../constants/Scanner';
// eslint-disable-next-line import/named
import { mockedSetCommandName, mockedDispatch } from '../../classes/AppCommand';
import * as commands from '../scanner';

jest.mock('../../classes/AppCommand');

describe('scanner commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openScanner()', () => {
    it('should work as expected', () => {
      const expected = {
        src: 'sgapi:scanner',
        modes: {
          [constants.SCANNER_TYPE_BARCODE]: constants.SCANNER_MODE_OFF,
          [constants.SCANNER_TYPE_CARD]: constants.SCANNER_MODE_OFF,
          [constants.SCANNER_TYPE_IMAGE]: constants.SCANNER_MODE_OFF,
        },
        animation: constants.SCANNER_ANIMATION_FOREGROUND_BOTTOM,
        eventParams: {
          scannerData: {
            modes: {
              barcodeRecognition: false,
              cardRecognition: false,
              imageCapturing: false,
            },
          },
          sourceTab: PWA_DEFAULT_TAB,
        },
      };

      commands.openScanner();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('openScanner');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith(expected);
    });

    it('should merge passed parameters properly', () => {
      const expected = {
        src: 'sgapi:scanner',
        modes: {
          [constants.SCANNER_TYPE_BARCODE]: constants.SCANNER_MODE_OFF,
          [constants.SCANNER_TYPE_IMAGE]: constants.SCANNER_MODE_ON,
          [constants.SCANNER_TYPE_CARD]: constants.SCANNER_MODE_OFF,
        },
        animation: constants.SCANNER_ANIMATION_FOREGROUND_BOTTOM,
        eventParams: {
          scannerData: {
            modes: {
              [constants.SCANNER_TYPE_BARCODE]: false,
              [constants.SCANNER_TYPE_IMAGE]: true,
              [constants.SCANNER_TYPE_CARD]: false,
            },
          },
          sourceTab: PWA_DEFAULT_TAB,
        },
      };

      commands.openScanner({
        modes: {
          imageCapturing: constants.SCANNER_MODE_ON,
        },
      });

      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('closeScanner()', () => {
    it('should work as expected', () => {
      const expected = {
        animation: constants.SCANNER_ANIMATION_FOREGROUND_BOTTOM,
      };

      commands.closeScanner();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('closeScanner');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith(expected);
    });

    it('should merge passed parameters properly', () => {
      const expected = {
        animation: constants.SCANNER_ANIMATION_FOREGROUND_LEFT,
      };

      commands.closeScanner({
        animation: constants.SCANNER_ANIMATION_FOREGROUND_LEFT,
      });

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('closeScanner');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('startScanner()', () => {
    it('should work as expected', () => {
      commands.startScanner();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('startScanner');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopScanner()', () => {
    it('should work as expected', () => {
      commands.stopScanner();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('stopScanner');
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
