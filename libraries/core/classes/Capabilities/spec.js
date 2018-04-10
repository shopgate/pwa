import capabilities from './index';

const mockedClientInformation = {};
jest.mock('../../commands/webStorage', () => ({
  getWebStorageEntry: () => ({
    then(cb) {
      cb({ value: mockedClientInformation });
    },
  }),
}));

describe('Capabilities', () => {
  describe('compareVersionsAtLeast', () => {
    const positives = [
      ['17', '17'],
      ['17', '17.0'],
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
    ];

    positives.forEach((v) => {
      it(`should return true for ${v.join(' >= ')}`, () => {
        expect(capabilities.constructor.compareVersionsAtLeast(v[0], v[1])).toBe(true);
      });
    });

    negatives.forEach((v) => {
      it(`should return false for ${v.join(' >= ')}`, () => {
        expect(capabilities.constructor.compareVersionsAtLeast(v[0], v[1])).toBe(false);
      });
    });
  });
  describe('isCommandSupported', () => {
    it('should resolve for unknown command', (done) => {
      capabilities.isCommandSupported('FOOBAR')
        .then(() => {
          done();
        })
        .catch(() => {
          throw new Error('Assert error');
        });
    });
    const commands = [
      {
        names: ['getCurrentBrightness', 'resetBrightness', 'setBrightness'],
        // [IOS, Android].
        positive: '17',
        negative: '16',
      },
    ];

    commands.forEach((c) => {
      c.names.forEach((n) => {
        it(`should resolve ${n} cmd with ${c.positive}`, (done) => {
          mockedClientInformation.libVersion = c.positive;
          // No expect(...).resolves because it always produces false positives.
          capabilities.isCommandSupported(n)
            .then(() => {
              done();
            })
            .catch(() => {
              throw new Error('Assert error');
            });
        });
        it(`should reject ${n} cmd with ${c.negative}`, (done) => {
          mockedClientInformation.libVersion = c.negative;
          capabilities.isCommandSupported(n)
            .then(() => {
              throw new Error('Assert error');
            })
            .catch(() => {
              done();
            });
        });
      });
    });
  });
});
