import getWebStorageEntry from '../commands/getWebStorageEntry';
import {
  isValidVersion,
  isVersionAtLeast,
  isVersionAtMost,
  isVersion,
  isLibVersionAtLeast,
  isLibVersionAtMost,
  isLibVersion,
  clearVersionCache,
  defaultClientInformation,
} from './version';

import { hasSGJavaScriptBridge } from './index';

let mockedClientInformation = null;

const mockedWebStorageResponse = jest.fn();

jest.mock('../commands/getWebStorageEntry', () => jest.fn().mockImplementation(() => ({
  then(cb) {
    mockedWebStorageResponse();
    cb({ value: mockedClientInformation });
  },
})));

const mockedErrorLogger = jest.fn();
jest.mock('./index', () => ({
  logger: {
    error: (...args) => {
      mockedErrorLogger(...args);
    },
  },
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));

/**
 * Updates the mocked client information.
 * @param {string} platform The platform.
 * @param {string} libVersion The libVersion.
 * @param {string} appVersion The appVersion.
 */
const setClientInformation = (platform = 'ios', libVersion = '15.0', appVersion = '10.18') => {
  mockedClientInformation = {
    libVersion,
    appVersion,
    device: {
      os: {
        platform,
      },
    },
  };
};

describe('Version helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedWebStorageResponse.mockClear();
    setClientInformation();
    clearVersionCache();
  });

  describe('isValidVersion()', () => {
    const positives = [
      '16',
      '16.0',
      '16.0.0',
      '16.1',
      '16.1.1',
    ];

    const negatives = [
      16,
      '16.a.1',
      '16.1.a',
      'foo',
      null,
      {},
      [],
    ];

    positives.forEach((value) => {
      it(`should return true for ${value}`, () => {
        expect(isValidVersion(value)).toBe(true);
      });
    });

    negatives.forEach((value) => {
      it(`should return false for ${value}`, () => {
        expect(isValidVersion(value)).toBe(false);
      });
    });
  });

  describe('isVersionAtLeast()', () => {
    const positives = [
      ['17', '17'],
      ['17', '17.0'],
      ['17', '17.0.0'],
      ['17', '17.0.1'],
      ['17', '18'],
      ['17.0', '17'],
      ['17.1', '17.1'],
      ['17.1', '17.2'],
      ['17.1.1', '17.1.1'],
      ['17.1.1', '17.1.2'],
    ];

    const negatives = [
      ['17', '16'],
      ['17.1', '17.0'],
      ['17.1', '17.0.9'],
      ['17.1.0', '17.0.1'],
      ['17.1.1', '17.1.0'],
      [],
    ];

    positives.forEach((value) => {
      it(`should return true for ${value.join(' <= ')}`, () => {
        expect(isVersionAtLeast(value[0], value[1])).toBe(true);
      });
    });

    negatives.forEach((value) => {
      it(`should return false for ${value.join(' <= ')}`, () => {
        expect(isVersionAtLeast(value[0], value[1])).toBe(false);
      });
    });
  });

  describe('isVersionAtMost()', () => {
    const positives = [
      ['17', '17'],
      ['17', '16'],
      ['17', '17.0'],
      ['17.0', '17'],
      ['17.1', '17.0'],
      ['17.1', '17.1'],
      ['17.1', '17.0.9'],
      ['17.1.1', '17.1.1'],
      ['17.1.0', '17.0.1'],
      ['17.1.1', '17.1.0'],
    ];

    const negatives = [
      ['17', '18'],
      ['17', '17.1'],
      ['17.1', '17.2'],
      ['17.1', '17.1.1'],
      ['17.1.1', '17.1.2'],
    ];

    positives.forEach((value) => {
      it(`should return true for ${value.join(' >= ')}`, () => {
        expect(isVersionAtMost(value[0], value[1])).toBe(true);
      });
    });

    negatives.forEach((value) => {
      it(`should return false for ${value.join(' >= ')}`, () => {
        expect(isVersionAtMost(value[0], value[1])).toBe(false);
      });
    });
  });

  describe('isVersion()', () => {
    const positives = [
      ['17', '17'],
      ['17', '17.0'],
      ['17', '17.0.0'],
      ['17.0', '17'],
      ['17.0', '17.0'],
      ['17.0', '17.0.0'],
      ['17.0.0', '17'],
      ['17.0.0', '17.0'],
      ['17.0.0', '17.0.0'],
    ];

    const negatives = [
      ['17', '16'],
      ['17.1', '17.0'],
      ['17.1', '17.0.1'],
      ['17.0.1', '17'],
      ['17.0.1', '17.1'],
      ['17.0.1', '17.1.2'],
    ];

    positives.forEach((value) => {
      it(`should return true for ${value.join(' == ')}`, () => {
        expect(isVersion(value[0], value[1])).toBe(true);
      });
    });

    negatives.forEach((value) => {
      it(`should return false for ${value.join(' >= ')}`, () => {
        expect(isVersion(value[0], value[1])).toBe(false);
      });
    });
  });

  describe('error handling and logging', () => {
    beforeEach(() => {
      mockedErrorLogger.mockClear();
    });

    const invalids = [
      'a',
      '1.a',
      'a.b.c',
      '0.1.c',
      'foobar',
      '',
    ];

    invalids.forEach((value) => {
      it(`should log an error and return false for "${value}"`, () => {
        expect(isVersion(value, '17.5.2')).toBe(false);
        expect(mockedErrorLogger).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('isLibVersionAtLeast()', () => {
    it('should return true for a value lower than the lib version', async () => {
      const result = await isLibVersionAtLeast('14.1.2');
      expect(result).toBe(true);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });

    it('should return false for a value greater than the lib version', async () => {
      const result = await isLibVersionAtLeast('15.1.2');
      expect(result).toBe(false);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });
  });

  describe('isLibVersionAtMost()', () => {
    it('should return true for a value lower than the lib version', async () => {
      const result = await isLibVersionAtMost('15.1.2');
      expect(result).toBe(true);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });

    it('should return false for a value greater than the lib version', async () => {
      const result = await isLibVersionAtMost('14.1.2');
      expect(result).toBe(false);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });
  });

  describe('isLibVersion()', () => {
    it('should return true for a value which does match the lib version', async () => {
      const result = await isLibVersion('15.0.0');
      expect(result).toBe(true);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });

    it('should return false for a value does not match the lib version', async () => {
      const result = await isLibVersion('14.1.2');
      expect(result).toBe(false);
      expect(getWebStorageEntry).toHaveBeenCalledTimes(1);
    });

    it('should use the default client information when no SGJavaScriptBridge is available', async () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);
      const result = await isLibVersion(defaultClientInformation.libVersion);
      expect(result).toBe(true);
      expect(getWebStorageEntry).not.toHaveBeenCalled();
    });
  });

  describe('clearVersionCache()', () => {
    it('should work as expected', async () => {
      clearVersionCache();
      await isLibVersion('15.0.0');
      await isLibVersion('15.0.0');
      expect(mockedWebStorageResponse).toHaveBeenCalledTimes(1);
      clearVersionCache();
      await isLibVersion('15.0.0');
      expect(mockedWebStorageResponse).toHaveBeenCalledTimes(2);
    });
  });

  describe('request handling', () => {
    it('should only request once for multiple parallel calls', async () => {
      isLibVersion('15.0.0');
      isLibVersion('15.0.0');
      const result = await isLibVersion('15.0.0');
      expect(result).toBe(true);
    });
  });
});
