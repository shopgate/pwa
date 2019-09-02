import { useBrowserConnector, hasSGJavaScriptBridge } from '../../helpers';
import Bridge from './index';
import BrowserConnector from '../BrowserConnector';
import DevServerBridge from '../DevServerBridge';

jest.mock('../../helpers', () => ({
  ...jest.requireActual('../../helpers'),
  useBrowserConnector: jest.fn(),
  hasSGJavaScriptBridge: jest.fn(),
}));

describe('Bridge', () => {
  let bridge;

  it('should use the BrowserConnector', () => {
    useBrowserConnector.mockReturnValueOnce(true);
    hasSGJavaScriptBridge.mockReturnValueOnce(false);
    bridge = new Bridge();
    expect(bridge.bridge instanceof BrowserConnector).toBe(true);
  });

  it('should use the DevServerBridge', () => {
    useBrowserConnector.mockReturnValueOnce(false);
    hasSGJavaScriptBridge.mockReturnValueOnce(false);
    bridge = new Bridge();
    expect(bridge.bridge instanceof DevServerBridge).toBe(true);
  });
});
