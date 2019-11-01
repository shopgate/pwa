import {
  mutable,
  next,
  skipRest,
  stop,
} from '../mutable';

describe('Mutable', () => {
  let original;
  beforeEach(() => {
    // Processes only one param by returning it by default
    original = jest.fn(data => data);
  });

  it('should call original', () => {
    const mutated = mutable(original);

    const res = mutated(100);

    expect(original).toBeCalledWith(100);
    expect(res).toEqual(100);
  });

  it('should replace original', () => {
    const mutated = mutable(original);

    const rewrite = jest.fn(data => data * 2);
    mutated.replace(rewrite);

    const res = mutated(100);

    expect(rewrite).toBeCalledWith(100);
    expect(original).toBeCalledTimes(0);
    expect(res).toEqual(200);
  });

  it('should restore and call original again', () => {
    const mutated = mutable(original);
    const rewrite = jest.fn();
    mutated.replace(rewrite);
    mutated.restore();

    const res = mutated(100);

    expect(rewrite).toBeCalledTimes(0);
    expect(original).toBeCalledWith(100);
    expect(res).toEqual(100);
  });

  it('should call useBefore pre-processor step without modifying params and call the original', () => {
    const mutated = mutable(original);
    const use = jest.fn();
    mutated.useBefore(use);

    const res = mutated(100);

    expect(use).toBeCalledWith(100);
    expect(original).toBeCalledWith(100);
    expect(res).toEqual(100);
  });

  it('should not call any pre-processor steps anymore and revert to the original', () => {
    const mutated = mutable(original);
    const use = jest.fn();
    mutated.useBefore(use);
    const rewrite = jest.fn();
    mutated.replace(rewrite);
    mutated.reset();

    const res = mutated(100);

    expect(use).toBeCalledTimes(0);
    expect(rewrite).toBeCalledTimes(0);
    expect(original).toBeCalledWith(100);
    expect(res).toEqual(100);
  });

  it('should transform params for the follow up step and action', () => {
    const mutated = mutable(original);
    const use1 = jest.fn(() => next(200, 50));
    const use2 = jest.fn(); // Does not transform and keep params from "use1" this time.
    mutated.useBefore(use1);
    mutated.useBefore(use2);

    const res = mutated(100, 300);

    expect(use1).toBeCalledWith(100, 300);
    expect(use2).toBeCalledWith(200, 50);
    expect(original).toBeCalledWith(200, 50);
    expect(res).toEqual(200);
  });

  it('should transform params for the follow up step and once again for action', () => {
    const mutated = mutable(original);
    const use1 = jest.fn(() => next(200, 50));
    const use2 = jest.fn(() => next('foo', 'bar'));
    mutated.useBefore(use1);
    mutated.useBefore(use2);

    const res = mutated(100, 300);

    expect(use1).toBeCalledWith(100, 300);
    expect(use2).toBeCalledWith(200, 50);
    expect(original).toBeCalledWith('foo', 'bar');
    expect(res).toEqual('foo');
  });

  it('should prevent further steps and the action from being executed at all after the first steps', () => {
    const mutated = mutable(original);
    const result = 'dummy';
    const use1 = jest.fn(() => stop(result));
    const use2 = jest.fn(() => next(200, 50));
    mutated.useBefore(use1);
    mutated.useBefore(use2);

    const res = mutated(100, 300);

    expect(use1).toBeCalledTimes(1);
    expect(use2).toBeCalledTimes(0);
    expect(original).toBeCalledTimes(0);
    expect(res).toEqual(result);
  });

  it('should skip forward to the original action directly', () => {
    const mutated = mutable(original);
    const use1 = jest.fn(() => skipRest('hello', 'world'));
    const use2 = jest.fn();
    const use3 = jest.fn(() => next(200, 50));
    mutated.useBefore(use1);
    mutated.useBefore(use2);
    mutated.useBefore(use3);

    const res = mutated(100, 300);

    expect(use1).toBeCalledTimes(1);
    expect(use2).toBeCalledTimes(0);
    expect(use3).toBeCalledTimes(0);
    expect(original).toBeCalledWith('hello', 'world');
    expect(res).toEqual('hello');
  });

  it('should skip forward to the replaced action directly', () => {
    const mutated = mutable(original);
    const use1 = jest.fn(() => skipRest('hello', 'world', '!!!111'));
    const use2 = jest.fn();
    const use3 = jest.fn(() => next(200, 50));
    mutated.useBefore(use1);
    mutated.useBefore(use2);
    // Rewrite returns the third param only
    const rewrite = jest.fn((data1, data2, data3) => data3);
    // Shows that replace can be called between "useBefore" calls and still work.
    mutated.replace(rewrite);
    mutated.useBefore(use3);

    const res = mutated(100, 300);

    expect(use1).toBeCalledTimes(1);
    expect(use2).toBeCalledTimes(0);
    expect(use3).toBeCalledTimes(0);
    expect(original).toBeCalledTimes(0);
    expect(rewrite).toBeCalledWith('hello', 'world', '!!!111');
    expect(res).toEqual('!!!111');
  });

  it('should always provide access to the original and the current replacement function', () => {
    const mutated = mutable(original);

    const rewrite = jest.fn();
    mutated.replace(rewrite);

    expect(mutated.original).toBe(original);
    expect(mutated.current).toEqual(rewrite);
  });
});
