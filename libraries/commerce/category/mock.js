const initialCategoryState = {
  category: {
    rootCategories: {},
    categoriesById: {},
    childrenByCategoryId: {},
    currentCategoryId: null,
  },
};

const categoryState = {
  category: {
    rootCategories: {
      categories: [
        'men',
        'women',
      ],
      expires: 9999999999999,
      isFetching: false,
    },
    categoriesById: {
      men: {
        id: 'men',
        name: 'Men',
        parent: {
          id: null,
          name: 'Default- category',
        },
        path: 'Men',
        description: '',
        imageUrl: 'https://shopgate-public.s3.amazonaws.com/categories/24453/1346609@2x.jpg',
        externalUrl: 'http://material-fashion.myshopify.com/collections/men',
        sort: 0,
        productCount: 6,
        childrenSort: 'import',
        childrenCount: 0,
        children: [],
        isFetching: false,
        expires: 9999999999999,
      },
      women: {
        id: 'women',
        name: 'Women',
        parent: {
          id: null,
          name: 'Default- category',
        },
        path: 'Women',
        description: '',
        imageUrl: 'https://shopgate-public.s3.amazonaws.com/categories/24453/1346610@2x.jpg',
        externalUrl: 'http://material-fashion.myshopify.com/collections/women',
        sort: 0,
        productCount: 6,
        childrenSort: 'import',
        childrenCount: 1,
        children: [],
        isFetching: false,
        expires: 9999999999999,
      },
    },
    childrenByCategoryId: {
      women: {
        children: [
          'test',
        ],
        isFetching: false,
        expires: 9999999999999,
      },
    },
    currentCategoryId: null,
  },
};

const homeRoute = {
  id: 'a4bf3a32-0ed8-4138-bb94-098f32f3aeb3',
  params: {},
  pathname: '/',
  pattern: '/',
  query: {},
  state: {},
};

const categoryRouteMock = {
  id: 'c8256921-3667-45d0-a0fe-a7a8bb5ed3b8',
  params: {},
  pathname: '/category',
  pattern: '/category',
  query: {},
  state: {
    title: 'Categories',
  },
};

const childCategoryRouteMock = {
  id: '5a227cfd-c55a-4e9b-9deb-d2ee20154030',
  params: {
    categoryId: '776f6d656e',
  },
  pathname: '/category/776f6d656e',
  pattern: '/category/:categoryId',
  query: {},
  state: {
    title: 'Women',
  },
};

const routerState = {
  router: {
    routing: false,
    stack: [
      { ...homeRoute },
    ],
  },
};

const uiState = {
  ui: {
    general: {},
  },
};

export {
  initialCategoryState,
  categoryState,
  routerState,
  categoryRouteMock,
  childCategoryRouteMock,
  uiState,
};
