const widgetRoute = {
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

const routerState = {
  router: {
    routing: false,
    stack: [
      { ...homeRoute },
      { ...widgetRoute },
    ],
  },
};

const widgetsInitialState = {
  page: {},
  ...routerState,
};

export {
  widgetsInitialState,
};