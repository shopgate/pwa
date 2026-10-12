describe('engage > locations > providers', () => {
  it('should be loadable before the index of the locations module', () => {
    let providers;

    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      providers = require('./index');
    });

    expect(Object.keys(providers).sort()).toEqual([
      'FulfillmentProvider',
      'StoreDetailsContext',
      'StoreDetailsProvider',
      'StoreFinderProvider',
      'openSheet',
    ]);
    Object.values(providers).forEach((entry) => {
      expect(entry).toBeDefined();
    });
  });

  it('should open the sheet via FulfillmentSheet.open when the providers are loaded first', () => {
    let FulfillmentSheet;
    let UIEvents;
    let EVENT_SET_OPEN;

    jest.isolateModules(() => {
      /* eslint-disable global-require */
      require('./index');
      ({ EVENT_SET_OPEN } = require('./FulfillmentProvider'));
      ({ UIEvents } = require('../../core'));
      ({ FulfillmentSheet } = require('../components/FulfillmentSheet'));
      /* eslint-enable global-require */
    });

    const emit = jest.spyOn(UIEvents, 'emit').mockImplementation(() => {});
    const params = { stage: 1 };

    FulfillmentSheet.open(params);

    expect(emit).toHaveBeenCalledWith(EVENT_SET_OPEN, params);
    emit.mockRestore();
  });
});
