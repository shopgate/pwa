import iso3166 from './iso-3166-2';
import buildProvinceList from './buildProvinceList';

describe('buildProvinceList', () => {
  it('should return empty list when country is unknown', () => {
    expect(buildProvinceList('SOME')).toEqual({});
  });

  it('should return a list with US provinces', () => {
    const expected = iso3166.US.divisions;
    expect(buildProvinceList('US')).toEqual(expected);
  });

  it('should return a list with US provinces and optional', () => {
    const expected = {
      '': '',
      ...iso3166.US.divisions,
    };
    expect(buildProvinceList('US', { '': '' })).toEqual(expected);
  });
});
