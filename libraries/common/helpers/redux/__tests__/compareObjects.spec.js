import { compareObjects } from '../compareObjects';

describe('compareObjects', () => {
  const obj1 = {
    abc: 123,
    def: 456,
    hij: 789,
  };

  const obj2 = {
    abc: 123,
    def: 456,
    hij: 789,
  };

  const obj3 = {
    abc: 123,
    def: 456,
    xyz: 234, // DIFFERENT !!
  };

  it('should compare equal objects', () => {
    expect(compareObjects(obj1, obj2)).toEqual(true);
    expect(compareObjects(obj2, obj1)).toEqual(true);
  });

  it('should compare unequal objects', () => {
    expect(compareObjects(obj1, obj3)).toEqual(false);
    expect(compareObjects(obj2, obj3)).toEqual(false);
    expect(compareObjects(obj3, obj1)).toEqual(false);
    expect(compareObjects(obj3, obj2)).toEqual(false);
  });
});
