import hideMenuBar from '@shopgate/pwa-core/commands/hideMenuBar';
import broadcastEvent from '@shopgate/pwa-core/commands/broadcastEvent';
import { prepareLegacyNavigation } from './index';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/pwa-core/commands/hideMenuBar', () => jest.fn());
jest.mock('@shopgate/pwa-core/commands/broadcastEvent', () => jest.fn());

describe('Legacy helpers', () => {
  describe('prepareLegacyNavigation()', () => {
    it('should dispatch the correct commands', () => {
      prepareLegacyNavigation();

      expect(broadcastEvent).toHaveBeenCalledTimes(1);
      expect(broadcastEvent).toHaveBeenCalledWith({
        event: 'updateNavigationBar',
        parameters: ['', 'none', { type: 'none' }],
      });
      expect(hideMenuBar).toHaveBeenCalledTimes(1);
      expect(hideMenuBar).toHaveBeenCalledWith({ animation: null });
    });
  });
});
