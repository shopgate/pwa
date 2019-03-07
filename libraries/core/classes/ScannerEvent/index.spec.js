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

    expect(e.getScope()).toBe(scope);
    expect(e.getType()).toBe(type);
    expect(e.getPayload()).toBe(payload);
  });
});
