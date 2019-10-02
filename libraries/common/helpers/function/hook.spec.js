/* eslint-disable extra-rules/no-single-line-objects */
import hook from './hook';

describe('Hook', () => {
  let original;
  beforeEach(() => {
    original = jest.fn(data => data);
  });

  it('should call original', () => {
    const hooked = hook(original);
    const res = hooked({ id: 100 });
    expect(original).toBeCalledWith({ id: 100 });
    expect(res).toEqual({ id: 100 });
  });

  it('should call use and original', () => {
    const hooked = hook(original);

    const use = jest.fn(data => ({
      ...data,
      name: 'bar',
    }));
    hooked.use(use);

    const res = hooked({ id: 100 });
    expect(use).toBeCalledWith({ id: 100 });
    expect(original).toBeCalledWith({ id: 100, name: 'bar' });
    expect(res).toEqual({ id: 100, name: 'bar' });
  });

  it('should rewrite original', () => {
    const hooked = hook(original);

    const rewrite = jest.fn(data => ({
      ...data,
      name: 'bar',
    }));
    hooked.rewrite(rewrite);

    const res = hooked({ id: 100 });
    expect(rewrite).toBeCalledWith({ id: 100 });
    expect(original).toBeCalledTimes(0);
    expect(res).toEqual({ id: 100, name: 'bar' });
  });

  it('should restore original', () => {
    const hooked = hook(original);
    const rewrite = jest.fn();
    hooked.rewrite(rewrite);
    hooked.restore();

    const res = hooked({ id: 100 });
    expect(rewrite).toBeCalledTimes(0);
    expect(original).toBeCalledWith({ id: 100 });
    expect(res).toEqual({ id: 100 });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
