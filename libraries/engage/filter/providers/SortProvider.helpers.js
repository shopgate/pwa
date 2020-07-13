import {
  SORT_ORDER_RELEVANCE,
  SORT_ORDER_PRICE_ASC,
  SORT_ORDER_PRICE_DESC,
  SORT_ORDER_NAME_ASC,
  SORT_ORDER_NAME_DESC,
  SORT_ORDER_RANK_ASC,
  SORT_ORDER_RANK_DESC,
} from '../constants';

const labelMapping = {
  [SORT_ORDER_RELEVANCE]: 'filter.sort.most_popular',
  [SORT_ORDER_PRICE_ASC]: 'filter.sort.price_asc',
  [SORT_ORDER_PRICE_DESC]: 'filter.sort.price_desc',
  [SORT_ORDER_NAME_ASC]: 'filter.sort.name_asc',
  [SORT_ORDER_NAME_DESC]: 'filter.sort.name_desc',
  [SORT_ORDER_RANK_ASC]: 'filter.sort.rank_asc',
  [SORT_ORDER_RANK_DESC]: 'filter.sort.rank_desc',
};

// Sort options for the products extension
const defaultOptions = [
  SORT_ORDER_RELEVANCE,
  SORT_ORDER_PRICE_DESC,
  SORT_ORDER_PRICE_ASC,
];

// Sort options for the catalog extension
const extendedOptions = [
  SORT_ORDER_NAME_ASC,
  SORT_ORDER_NAME_DESC,
  SORT_ORDER_RANK_ASC,
  SORT_ORDER_RANK_DESC,
  SORT_ORDER_PRICE_ASC,
  SORT_ORDER_PRICE_DESC,
];
/**
 * Creates a list of available sort options for the current sorting scope
 * @param {string} scope The sort scope
 * @param {boolean} [useExtendedOptions=false] Wether extended options are supported
 * @returns {Array}
 */
export const getSortOptions = (scope, useExtendedOptions = false) => {
  const options = useExtendedOptions ? extendedOptions : defaultOptions;

  return options.map(option => ({
    label: labelMapping[option],
    value: option,
  }));
};

