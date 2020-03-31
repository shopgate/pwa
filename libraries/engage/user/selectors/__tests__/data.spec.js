import { getUserId } from '../data';

describe('engage > user > selectors > data', () => {
  it('should return user id for logged in user', () => {
    const result = getUserId({
      user: {
        login: {},
        data: { id: 123456 },
      },
    });
    expect(result).toBe(123456);
  });
  it('should return null if user is not logged in', () => {
    const result = getUserId({
      user: {
        login: {},
        data: {},
      },
    });
    expect(result).toBe(null);
  });
});
