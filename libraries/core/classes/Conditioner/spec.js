import Conditioner from './index';

describe('Conditioner', () => {
  let conditioner;

  let cond1;
  let cond2;
  let cond3;

  beforeEach(() => {
    conditioner = new Conditioner();
    cond1 = jest.fn().mockReturnValue(true);
    cond2 = jest.fn().mockReturnValue(true);
    cond3 = jest.fn().mockReturnValue(true);
  });

  it('should fail on first sorted condition', async () => {
    cond3.mockReturnValue(false);
    conditioner.addConditioner(1, cond1);
    conditioner.addConditioner(2, cond2, -1);
    conditioner.addConditioner(3, cond3, -2);

    expect(await conditioner.check()).toBeFalsy();
    expect(cond3).toBeCalledTimes(1);
    expect(cond1).toBeCalledTimes(0);
    expect(cond2).toBeCalledTimes(0);
  });

  it('should fail on first promisified sorted condition', async () => {
    expect.assertions(4);
    cond3.mockResolvedValue(false);

    conditioner.addConditioner(1, cond1);
    conditioner.addConditioner(2, cond2, -1);
    conditioner.addConditioner(2, cond3, -2);

    expect(await conditioner.check()).toBeFalsy();
    expect(cond3).toBeCalledTimes(1);
    expect(cond1).toBeCalledTimes(0);
    expect(cond2).toBeCalledTimes(0);
  });

  it('should fail on second promisified sorted condition', async () => {
    expect.assertions(4);
    cond3.mockResolvedValue(false);

    conditioner.addConditioner(1, cond1);
    conditioner.addConditioner(2, cond2, -10);
    conditioner.addConditioner(2, cond3, -2);

    expect(await conditioner.check()).toBeFalsy();
    expect(cond3).toBeCalledTimes(1);
    expect(cond1).toBeCalledTimes(0);
    expect(cond2).toBeCalledTimes(0);
  });

  it('should resolve true', async () => {
    conditioner.addConditioner(1, cond1);
    conditioner.addConditioner(2, cond2);
    conditioner.addConditioner(3, cond3);

    expect(await conditioner.check()).toBeTruthy();
    expect(cond1).toBeCalledTimes(1);
    expect(cond2).toBeCalledTimes(1);
    expect(cond3).toBeCalledTimes(1);
  });

  it('should return cloned conditioner', async () => {
    conditioner.addConditioner('one', cond1);
    conditioner.addConditioner('two', cond2);

    const newConditioner = conditioner.without('one');

    expect(newConditioner).not.toBe(conditioner);
    expect(newConditioner.conditions).not.toBe(conditioner.conditions);
    expect(newConditioner.conditions.has('one')).toBeFalsy();
    expect(newConditioner.conditions.has('two')).toBeTruthy();
  });
});
