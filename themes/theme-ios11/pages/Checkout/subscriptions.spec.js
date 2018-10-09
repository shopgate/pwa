import subscriptions from './subscriptions';

jest.useFakeTimers();
const mockedEnableNavigator = jest.fn();
const mockedDisableNavigator = jest.fn();
const mockedGoBackHistory = jest.fn();

jest.mock(
  '@shopgate/pwa-common/actions/history/goBackHistory',
  () => (...args) => mockedGoBackHistory(...args)
);

jest.mock(
  'Components/Navigator/actions/enableNavigator',
  () => (...args) => mockedEnableNavigator(...args)
);

jest.mock(
  'Components/Navigator/actions/disableNavigator',
  () => (...args) => mockedDisableNavigator(...args)
);

describe('Checkout subscriptions', () => {
  const subscribe = jest.fn();
  let didEnter;
  let didLeave;
  it('should subscribe to two streams', () => {
    subscriptions(subscribe);
    expect(subscribe).toHaveBeenCalledTimes(2);
    [didEnter, didLeave] = subscribe.mock.calls;
  });
  it('should dispatch actions on did enter', () => {
    const dispatch = jest.fn();
    didEnter[1]({ dispatch });
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockedDisableNavigator).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(20000);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mockedGoBackHistory).toHaveBeenCalledTimes(1);
  });
  it('should dispatch actions on did leave', () => {
    const dispatch = jest.fn();
    didLeave[1]({ dispatch });
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(mockedEnableNavigator).toHaveBeenCalledTimes(1);
  });
});
