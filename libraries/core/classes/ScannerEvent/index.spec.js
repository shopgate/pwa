import ScannerEvent from './index';

describe('ScannerEvent', () => {
  it('should set and return all values correctly', () => {
    const input = {
      scope: 'scope',
      type: 'type',
      payload: {
        format: 'format',
        code: 'code',
      },
    };
    const expected = {
      scope: 'scope',
      type: 'type',
      payload: {
        format: 'format',
        code: 'code',
      },
    };

    const e = new ScannerEvent(input.scope, input.type, input.payload);

    expect(e.getScope()).toStrictEqual(expected.scope);
    expect(e.getType()).toStrictEqual(expected.type);
    expect(e.getPayload()).toStrictEqual(expected.payload);
  });
});
