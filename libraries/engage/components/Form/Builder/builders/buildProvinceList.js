import iso3166 from '../iso-3166-2';

/**
 * Returns a list of provinces based on the given country id
 *
 * @param {string} countryCode Country code of the country to fetch provinces from
 * @param {?Object} optional object to prepend optional choice
 * @return {Object}
 */
export default (countryCode, optional = null) => {
  if (!iso3166) {
    return {};
  }

  /** @property {iso3166} divisions */
  const provinceList = iso3166[countryCode] ? iso3166[countryCode].divisions : {};
  if (!optional) {
    return provinceList;
  }
  return {
    ...optional,
    ...provinceList,
  };
};
