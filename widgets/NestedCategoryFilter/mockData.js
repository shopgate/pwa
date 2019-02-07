export const rootCategories = {
  categories: ['1', '2'],
  isFetching: false,
};

export const emptyRootCategories = {
  isFetching: true,
};

export const childrenByCategoryId = {
  1: {
    children: ['1-1', '1-2'],
    isFetching: false,
  },
};

export const categoriesById = {
  1: {
    id: '1',
    name: 'Category 1',
    childrenCount: 2,
    isFetching: false,
  },
  2: {
    id: '2',
    name: 'Category 2',
    childrenCount: 0,
    isFetching: false,
  },
  '1-1': {
    id: '1-1',
    name: 'Category 1-1',
    childrenCount: 0,
    isFetching: false,
  },
  '1-2': {
    id: '1-2',
    name: 'Category 1-2',
    childrenCount: 0,
    isFetching: false,
  },
};

export const mockedState = {
  category: {
    rootCategories,
    childrenByCategoryId,
    categoriesById,
  },
};
