const widgetsPageRoute = {
  id: 'd82ea770-5627-4d1e-a301-a06bbe0d5cbd',
  params: {
    pageId: 'cms_test',
  },
  pathname: '/page/cms_test',
  pattern: '/page/:pageId',
  query: {},
  state: {},
};

const homeRoute = {
  id: 'a4bf3a32-0ed8-4138-bb94-098f32f3aeb3',
  params: {},
  pathname: '/',
  pattern: '/',
  query: {},
  state: {},
};

const page = {
  cms_test: {
    title: 'CMS Test Page',
    widgets: [
      {
        type: '@shopgate/commerce-widgets/html',
        settings: {
          html: 'Hi Test test',
          latestEditorMode: 'source',
          defaultPadding: true,
        },
        id: 'cms_test-0-@shopgate/commerce-widgets/html',
      },
    ],
    isFetching: false,
    expires: 9999999999999,
  },
};

const routerState = {
  router: {
    routing: false,
    stack: [
      { ...homeRoute },
      { ...widgetsPageRoute },
    ],
  },
};

const widgetsInitialState = {
  page: {},
  ui: {
    general: {
      title: null,
    },
  },
  ...routerState,
};

const widgetsState = {
  page,
  ui: {
    general: {
      title: null,
    },
  },
  ...routerState,
};

export {
  widgetsState,
  widgetsInitialState,
  widgetsPageRoute,
};
