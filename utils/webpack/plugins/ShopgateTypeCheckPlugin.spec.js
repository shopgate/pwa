const ShopgateTypeCheckPlugin = require('./ShopgateTypeCheckPlugin');

const TYPE_ERROR = {
  file: null,
  line: null,
  column: null,
  code: 'TS2322',
  message: 'Wrong type.',
};
const BUILD_ERROR = { message: 'Module not found.' };

describe('ShopgateTypeCheckPlugin', () => {
  let plugin;
  let devServer;

  beforeEach(() => {
    devServer = {
      sendMessage: jest.fn(),
      webSocketServer: {
        clients: ['tab'],
        implementation: { on: jest.fn() },
      },
    };
    plugin = new ShopgateTypeCheckPlugin({ overlay: true });
    plugin.setDevServer(devServer);
  });

  it('sends nothing as long as there are no type errors', () => {
    plugin.buildErrors = [BUILD_ERROR];
    plugin.updateOverlay();

    expect(devServer.sendMessage).not.toHaveBeenCalled();
  });

  it('shows type errors together with the errors of the build', () => {
    plugin.buildErrors = [BUILD_ERROR];
    plugin.results.set('theme', [TYPE_ERROR]);
    plugin.updateOverlay();

    expect(devServer.sendMessage).toHaveBeenCalledWith(['tab'], 'errors', [
      BUILD_ERROR,
      {
        moduleName: 'theme',
        loc: '',
        message: 'TS2322: Wrong type.',
      },
    ]);
  });

  it('removes the overlay when the last type error is fixed', () => {
    plugin.results.set('theme', [TYPE_ERROR]);
    plugin.updateOverlay();
    plugin.results.set('theme', []);
    plugin.updateOverlay();

    expect(devServer.sendMessage).toHaveBeenLastCalledWith(['tab'], 'still-ok');
  });

  it('keeps the errors of the build in the overlay when the last type error is fixed', () => {
    plugin.results.set('theme', [TYPE_ERROR]);
    plugin.updateOverlay();
    plugin.results.set('theme', []);
    plugin.buildErrors = [BUILD_ERROR];
    plugin.updateOverlay();

    expect(devServer.sendMessage).toHaveBeenLastCalledWith(['tab'], 'errors', [BUILD_ERROR]);
  });

  it('does not show anything without the overlay option', () => {
    plugin = new ShopgateTypeCheckPlugin();
    plugin.setDevServer(devServer);
    plugin.results.set('theme', [TYPE_ERROR]);
    plugin.updateOverlay();

    expect(devServer.sendMessage).not.toHaveBeenCalled();
  });
});
