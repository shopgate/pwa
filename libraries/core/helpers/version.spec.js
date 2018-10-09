import {
  PLATFORM_ANDROID,
  MIN_ANDROID_LIB_VERSION,
  isValidVersion,
  isVersionAtLeast,
  isVersionAtMost,
  isVersion,
  isLibVersionAtLeast,
  isLibVersionAtMost,
  isLibVersion,
  getLibVersion,
} from './version';

let mockedClientInformation = null;

const mockedWebStorageResponse = jest.fn();

jest.mock('../commands/webStorage', () => ({
  getWebStorageEntry: () => ({
    then(cb) {
      mockedWebStorageResponse();
      cb({ value: mockedClientInformation });
    },
  }),
}));

const mockedErrorLogger = jest.fn();
jest.mock('./index', () => ({
  logger: {
    error: (...args) => {
      mockedErrorLogger(...args);
    },
  },
}));

/**
 * Updates the mocked client information.
 * @param {string} platform The platform.
 * @param {string} libVersion The libVersion.
 * @param {string} appVersion The appVersion.
 */
const setClientInformation = (platform = 'ios', libVersion = '17.0', appVersion = '10.18') => {
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
    mockedWebStorageResponse.mockClear();
    setClientInformation();
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
      const result = await isLibVersionAtLeast('16.1.2');
      expect(result).toBe(true);
    });

    it('should return false for a value greater than the lib version', async () => {
      const result = await isLibVersionAtLeast('17.1.2');
      expect(result).toBe(false);
    });
  });

  describe('isLibVersionAtMost()', () => {
    it('should return true for a value lower than the lib version', async () => {
      const result = await isLibVersionAtMost('17.1.2');
      expect(result).toBe(true);
    });

    it('should return false for a value greater than the lib version', async () => {
      const result = await isLibVersionAtMost('16.1.2');
      expect(result).toBe(false);
    });
  });

  describe('isLibVersion()', () => {
    it('should return true for a value which does match the lib version', async () => {
      const result = await isLibVersion('17.0.0');
      expect(result).toBe(true);
    });

    it('should return false for a value does not match the lib version', async () => {
      const result = await isLibVersion('16.1.2');
      expect(result).toBe(false);
    });
  });

  describe('getLibVersion()', () => {
    it('should work as expected', async () => {
      const { libVersion } = mockedClientInformation;
      const result = await getLibVersion();
      expect(result).toEqual(libVersion);
    });

    it('should return the lib version from within the client information for iOS', async () => {
      const libVersion = '15.0';
      setClientInformation(undefined, libVersion);
      const result = await getLibVersion();
      expect(result).toEqual(libVersion);
    });

    it('should return the minimum lib version for old Android apps', async () => {
      setClientInformation(PLATFORM_ANDROID, '2.0');
      const result = await getLibVersion();
      expect(result).toEqual(MIN_ANDROID_LIB_VERSION);
    });

    it('should return the real lib version for recent Android apps', async () => {
      const libVersion = '16.0';
      setClientInformation(PLATFORM_ANDROID, libVersion);
      const result = await getLibVersion();
      expect(result).toEqual(libVersion);
    });
  });

  describe('request handling', () => {
    it('should only request once for multiple parallel calls', async () => {
      isLibVersion('17.0.0');
      isLibVersion('17.0.0');
      const result = await isLibVersion('17.0.0');
      expect(result).toBe(true);
      expect(mockedWebStorageResponse).toHaveBeenCalledTimes(1);
    });
  });
});
