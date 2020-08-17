import { mockedProducts as mockedList } from '../product/mock';

export const mockedDefaultListId = 'DEFAULT';

const mockedStateWithoutProducts = {
  favorites: {
    byList: {
      [mockedDefaultListId]: {
        isFetching: false,
        expires: 0,
        ids: [],
      },
    },
    lists: {
      expires: 0,
      lists: [{
        id: mockedDefaultListId,
        name: 'Wish List',
      }],
    },
  },
};

/**
 * Creates a products state from the mocked list.
 * @return {Object}
 */
const createProductsState = () => {
  const productsById = mockedList.products.reduce((result, current) => ({
    ...result,
    [current.id]: {
      isFetching: false,
      expires: 0,
      productData: current,
    },
  }), {});

  return {
    product: {
      productsById,
    },
  };
};

const mockedStateWithProducts = {
  ...createProductsState(),
  favorites: {
    byList: {
      [mockedDefaultListId]: {
        isFetching: false,
        expires: 0,
        ids: [mockedList.products[0].id, mockedList.products[1].id],
      },
    },
    lists: {
      expires: 0,
      lists: [{
        id: mockedDefaultListId,
        name: 'Wish List',
      }],
    },
  },
};

/**
 * Gets mocked state.
 * @param {boolean} withProducts When true products are returned.
 * @param {boolean} validCache When true, `.expires` flag is > `Date.now()`
 * @returns {Object}
 */
const getMockedState = ({ withProducts, validCache = false }) => {
  const data = withProducts ? mockedStateWithProducts : mockedStateWithoutProducts;
  if (validCache) {
    data.favorites.byList[mockedDefaultListId].expires = Date.now() + 999999;
  }

  return data;
};

/**
 * Gets mocked state.
 * @param {'then'|string} variant Variant as in MockedPipelineResponse.
 * @param {boolean} withProducts When true products are returned.
 * @param {boolean} validCache When true, `.expires` flag is > `Date.now()`
 * @returns {Function}
 */
const mockedGetState = (variant, { withProducts = false, validCache = false } = {}) => () => {
  if (variant === 'then') {
    return getMockedState({
      withProducts,
      validCache,
    });
  }
  return getMockedState({ withProducts: false });
};

export {
  mockedList,
  mockedGetState,
};
