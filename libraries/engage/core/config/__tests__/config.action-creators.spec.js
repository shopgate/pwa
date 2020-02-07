import { requestConfig, receiveConfig, errorConfig } from '../config.action-creators';

describe('engage > core > config > actions-creators', () => {
  test('requestConfig', () => {
    expect(requestConfig()).toMatchSnapshot();
  });

  test('receiveConfig', () => {
    expect(receiveConfig({
      merchantSettings: {
        foo: 'bar',
      },
    })).toMatchSnapshot();
  });

  test('errorConfig', () => {
    expect(errorConfig(new Error('Pipeline failed'))).toMatchSnapshot();
  });
});
