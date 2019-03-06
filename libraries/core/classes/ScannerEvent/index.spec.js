import ScannerEvent from './index';

describe('ScannerEvent', () => {
  it('should set and return all values correctly', () => {
    const scope = 'scope';
    const type = 'type';
    const payload = {
      format: 'format',
      code: 'code',
    };
    const e = new ScannerEvent(scope, type, payload);

    expect(e.getScope()).toStrictEqual(scope);
    expect(e.getType()).toStrictEqual(type);
    expect(e.getPayload()).toStrictEqual(payload);
  });
});
