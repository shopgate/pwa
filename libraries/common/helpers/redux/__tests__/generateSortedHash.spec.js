import { generateSortedHash } from '../generateSortedHash';

describe('generateSortedHash', () => {
  it('should generate a hash', () => {
    const obj1 = {
      abc: 12,
      hij: 567,
      def: 345,
    };

    const obj2 = {
      abc: 12,
      hij: [
        'asdasd',
        'asdasdasd',
        {
          56: '34534',
          67: 'sdfdf',
          12: 'sdsdf',
        },
      ],
      def: 345,
    };

    expect(generateSortedHash(obj1)).toEqual('{"abc":12,"def":345,"hij":567}');
    expect(generateSortedHash(obj2)).toEqual('{"abc":12,"def":345,"hij":["asdasd","asdasdasd",{"12":"sdsdf","56":"34534","67":"sdfdf"}]}');
  });
});
